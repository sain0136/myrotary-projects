import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";
import Stripe from "stripe";
import Database from "@ioc:Adonis/Lucid/Database";
import { LogManager } from "App/Utils/AppLogger";
import { LogTools } from "App/Utils/AppLogger";

export default class StripesController {
  private logManager: LogManager;

  constructor() {
    this.logManager = new LogManager();
  }

  public async store({ request }: HttpContextContract) {
    try {
      const payload = request.body() as Stripe.Event;
      const signature = request.header("stripe-signature");
      const rawBody = request.raw();

      // Verify the webhook signature
      await this.verifyWebhook(signature, rawBody);

      if (
        payload.type === "checkout.session.completed" &&
        payload.data.object.metadata
      ) {
        this.handleCheckoutCompleted(payload);
      }

      if (
        payload.type === "customer.subscription.deleted" &&
        payload.data.object.metadata
      ) {
        const subscriptionId = payload.data.object.id;
        // Proceed with updating user and club subscription status in database
        if (subscriptionId) {
          await this.processDeletedSubscription(subscriptionId);
        } else {
          throw new Error("Subscription ID not found in payload");
        }
      }
    } catch (error) {
      this.logManager.log(LogTools.LogTypes.CUSTOM_LOG, {
        type: "stripe_error",
        event: "stripe events",
        source: "StripeController",
        status: "failed",
        target: "database",
        message: error,
        customMessage: "Stripe webhook error",
      });
    }
  }

  private async processDeletedSubscription(subscriptionId: string) {
    try {
      await Database.transaction(async (trx) => {
        // Set the subscription status to inactive for the user
        await trx
          .query()
          .from("users")
          .where("subscription_id", subscriptionId)
          .update({
            subscription_id: "", // Clear the subscription ID if needed
          });

        // Set the subscription status to inactive for the club
        await trx
          .query()
          .from("clubs")
          .where("subscription_id", subscriptionId)
          .update({
            subscription_id: "",
          });
      });
      this.logManager.log(LogTools.LogTypes.CUSTOM_LOG, {
        type: "stripe_success",
        event: "customer.subscription.deleted",
        source: `subscription: ${subscriptionId}`,
        status: "success",
        message: "Stripe subscription deleted",
      });
    } catch (error) {
      this.logManager.log(LogTools.LogTypes.CUSTOM_LOG, {
        type: "stripe_error",
        event: "customer.subscription.deleted",
        source: `subscription: ${subscriptionId}`,
        status: "failed",
        target: "database",
        message: error,
        customMessage: "Stripe subscription write to DB failed",
      });
    }
  }

  private async handleCheckoutCompleted(
    payload: Stripe.CheckoutSessionCompletedEvent
  ) {
    const { userId, clubId } = payload.data.object.metadata!;
    const subscriptionId = payload.data.object.subscription;
    if (subscriptionId && userId && clubId) {
      try {
        // these are both automatic transactions, so if they fail the transaction will be rolled back
        await Database.transaction(async (trx) => {
          await trx.query().from("users").where("user_id", userId).update({
            subscription_id: subscriptionId.toString(),
          });
        });

        await Database.transaction(async (trx) => {
          await trx.query().from("clubs").where("club_id", clubId).update({
            subscription_id: subscriptionId.toString(),
          });
        });

        this.logManager.log(LogTools.LogTypes.CUSTOM_LOG, {
          type: "stripe_success",
          event: "checkout.session.completed",
          source: `user: ${userId}, club: ${clubId}`,
          status: "success",
          message: "Stripe subscription created",
          customMessage: "Stripe subscription created",
        });
      } catch (error) {
        this.logManager.log(LogTools.LogTypes.CUSTOM_LOG, {
          type: "stripe_error",
          event: "checkout.session.completed",
          source: `user: ${userId}`,
          status: "failed",
          target: `club: ${clubId}, user: ${userId}`,
          message: error,
          customMessage: "Stripe subscription write to DB failed",
        });
      }
    }
  }

  public async stripeRegistration({ request, response }: HttpContextContract) {
    const payload = request.body() as {
      userId: string;
      clubId: string;
      langCode?: Stripe.Checkout.SessionCreateParams.Locale | undefined;
    };
    const apiKey = Env.get("STRIPE_SECRET");
    const frontendDomain = Env.get("FRONTEND_DOMAIN");
    const priceId = Env.get("PRODUCT_PRICE_ID");
    const stripe = new Stripe(apiKey, { typescript: true });
    const locale = payload.langCode ? payload.langCode : "en";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId, // Use the price ID of the product (not the product ID itself)
          quantity: 1,
        },
      ],
      mode: "subscription", // Set the mode to subscription
      success_url: `${frontendDomain}/subscribe?status=success`,
      cancel_url: frontendDomain,
      metadata: {
        userId: payload.userId,
        clubId: payload.clubId,
      },
      client_reference_id: payload.userId,
      locale: locale,
    });

    return response.status(200).json({ url: session.url });
  }

  async verifyWebhook(signature: any, rawBody: any) {
    let event: Stripe.Event;
    const stripeWebhookSecret = Env.get("STRIPE_WEBHOOK_SECRET");

    if (!signature) {
      throw new Error("Webhook Error: Missing signature");
    }

    try {
      // Verify the event with the signing secret
      event = Stripe.webhooks.constructEvent(
        rawBody,
        signature,
        stripeWebhookSecret
      );
      return true;
    } catch (err) {
      throw new Error("Webhook signature verification failed");
    }
  }
}
