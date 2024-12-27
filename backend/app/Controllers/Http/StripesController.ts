import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";
import Stripe from "stripe";
import Database from "@ioc:Adonis/Lucid/Database";
import { LogManager } from "App/Utils/AppLogger";
import { LogTools } from "App/Utils/AppLogger";
import CustomException from "App/Exceptions/CustomException";
import { CustomErrorType } from "App/Utils/CommonTypes";
import Users from "App/Models/Users";
import { DateTime } from "luxon";
import { IExtraDetails } from "App/Shared/Interfaces/IUser";

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
        // Proceed with updating user and club subscription status in database - this is when the subscription actually ends and is not just cancelled
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
        status: LogTools.Status.FAIL,
        target: "database",
        message: error,
        customMessage: "Stripe webhook error",
      });
    }
  }

  private async processDeletedSubscription(subscriptionId: string) {
    try {
      let user: Users;
      user = await Users.findByOrFail("subscription_id", subscriptionId);
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
      if (user) {
        await this.updateSubscriptionEndDate(user.userId, null, true);
      }

      this.logManager.log(LogTools.LogTypes.CUSTOM_LOG, {
        type: "stripe_success",
        event: "customer.subscription.deleted",
        source: `subscription: ${subscriptionId}`,
        status: LogTools.Status.SUCCESS,
        message: "Stripe subscription deleted",
      });
    } catch (error) {
      this.logManager.log(LogTools.LogTypes.CUSTOM_LOG, {
        type: "stripe_error",
        event: "customer.subscription.deleted",
        source: `subscription: ${subscriptionId}`,
        status: LogTools.Status.FAIL,
        target: "database",
        message: error,
        customMessage: "Stripe subscription cancelation write to DB failed",
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
          status: LogTools.Status.SUCCESS,
          message: "Stripe subscription created",
        });
      } catch (error) {
        this.logManager.log(LogTools.LogTypes.CUSTOM_LOG, {
          type: "stripe_error",
          event: "checkout.session.completed",
          source: `user: ${userId}`,
          status: LogTools.Status.FAIL,
          target: `club: ${clubId}, user: ${userId}`,
          message: error,
          customMessage: "Stripe subscription write to DB failed",
        });
      }
    }
  }

  public async stripeRegistration({ request, response }: HttpContextContract) {
    try {
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
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  async cancelSubscription({ request, response }: HttpContextContract) {
    try {
      const { subscriptionId, userId } = request.body();
      const apiKey = Env.get("STRIPE_SECRET");
      const stripe = new Stripe(apiKey, { typescript: true });

      const updatedSubscription = await stripe.subscriptions.update(
        subscriptionId,
        {
          cancel_at_period_end: true,
        }
      );

      const timestamp = updatedSubscription.cancel_at;
      if (!timestamp) {
        throw new Error("Subscription cancellation failed");
      }
      const date = DateTime.fromSeconds(timestamp);
      await this.updateSubscriptionEndDate(userId, date);
      const updatedUser = await Users.findOrFail(userId);
      this.logManager.log(LogTools.LogTypes.CUSTOM_LOG, {
        type: "stripe_success",
        event: "subscription.cancelled",
        source: `subscription: ${subscriptionId}, user: ${userId}`,
        status: "success",
        message: "Stripe subscription cancelled",
      });
      return response.status(200).json(updatedUser);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  private async updateSubscriptionEndDate(
    userId: any,
    date?: DateTime | null,
    cancel?: boolean
  ) {
    const user = await Users.findOrFail(userId);
    const updatedExtraDetails = user.extraDetails as IExtraDetails;
    if (date) {
      updatedExtraDetails.subscription_end_date = date.toISO() as string;
    } else if (cancel) {
      delete updatedExtraDetails.subscription_end_date;
    }
    await user
      .merge({ extraDetails: JSON.stringify(updatedExtraDetails) })
      .save();
  }

  async verifyWebhook(signature: any, rawBody: any) {
    const stripeWebhookSecret = Env.get("STRIPE_WEBHOOK_SECRET");

    if (!signature) {
      throw new Error("Webhook Error: Missing signature");
    }

    try {
      // Verify the event with the signing secret
      let event = Stripe.webhooks.constructEvent(
        rawBody,
        signature,
        stripeWebhookSecret
      );
      this.logManager.log(LogTools.LogTypes.CUSTOM_LOG, {
        type: "stripe_success",
        event: "webhook.verified",
        source: "StripeController",
        status: "success",
        message: "Stripe webhook signature verified",
      });
      return event;
    } catch (err) {
      throw new Error("Webhook signature verification failed");
    }
  }
}
