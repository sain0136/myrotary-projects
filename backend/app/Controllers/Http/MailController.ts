import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Mail from "@ioc:Adonis/Addons/Mail";
import CustomException from "App/Exceptions/CustomException";
import { CustomErrorType } from "App/Utils/CommonTypes";
import { IEmail } from "App/Shared/Interfaces/IMail";
import Env from "@ioc:Adonis/Core/Env";

export default class MailController {
  public async send({ request, response }: HttpContextContract) {
    try {
      const newEmail = request.body() as IEmail;
      await Mail.send((message) => {
        message
          .from(Env.get("SMTP_SENDER_ADDRESS"))
          .to(Env.get("SMTP_RECEIVER_ADDRESS"))
          .replyTo(newEmail.senderEmail)
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

  private subjectLineFormatter(
    subject: string,
    senderName: string | undefined
  ) {
    const sender = senderName ? senderName : "Anonymous";
    return `${subject}: ${sender}`;
  }

  private bodyFormatter(email: IEmail) {
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
