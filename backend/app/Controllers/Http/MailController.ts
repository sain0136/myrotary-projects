import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Mail from "@ioc:Adonis/Addons/Mail";
import CustomException from "App/Exceptions/CustomException";
import { CustomErrorType } from "App/Utils/CommonTypes";
import { IEmail } from "App/Shared/Interfaces/IMail";
import Env from "@ioc:Adonis/Core/Env";
import rotaryLogger from "App/Utils/rotatryLogger";

export default class MailController {
  public async send({ request, response }: HttpContextContract) {
    try {
      const newEmail = request.body() as IEmail;
      rotaryLogger(
        "INFO",
        {
          message: "Attempting to send email to " + newEmail.senderEmail,
        },
        request
      );
      await Mail.send((message) => {
        message
          .from(Env.get("SMTP_SENDER_ADDRESS"))
          .to(newEmail.receiverEmail || Env.get("SMTP_RECEIVER_ADDRESS"))
          .replyTo(newEmail.senderEmail || Env.get("SMTP_SENDER_ADDRESS"))
          .subject(
            this.subjectLineFormatter(newEmail.subject, newEmail.senderName)
          )
          .html(this.bodyFormatter(newEmail));
      });
      return response.json(true);
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  public async sendMail(newEmail: IEmail, customFormat?: string) {
    const format = customFormat ? customFormat : this.bodyFormatter(newEmail);
    try {
      await Mail.sendLater((message) => {
        message
          .from(Env.get("SMTP_SENDER_ADDRESS"))
          .to(newEmail.receiverEmail || Env.get("SMTP_RECEIVER_ADDRESS"))
          .replyTo(newEmail.senderEmail || Env.get("SMTP_SENDER_ADDRESS"))
          .subject(
            this.subjectLineFormatter(newEmail.subject, newEmail.senderName)
          )
          .html(format);
      });
    } catch (error) {
      throw new CustomException(error as CustomErrorType);
    }
  }

  private subjectLineFormatter(
    subject: string,
    senderName: string | undefined
  ) {
    const sender = senderName ? senderName : "Anonymous";
    return `${subject}: ${sender}`;
  }

  private bodyFormatter(email: IEmail): string {
    let body = "";
    if (email.messageBody.messageIntructions) {
      body += `<b>${email.messageBody.messageIntructions}</b>`;
    }
    if (email.messageBody.senderMeta) {
      body += `<p>${email.messageBody.senderMeta}</p>`;
    }
    body += `<p>${email.messageBody.message}</p>`;
    return body;
  }
}
