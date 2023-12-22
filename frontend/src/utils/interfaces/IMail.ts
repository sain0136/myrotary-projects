export interface IEmail {
  senderEmail: string;
  senderName?: string;
  subject: string;
  messageBody: {
    messageIntructions?: string;
    message: string;
    senderMeta?: boolean;
  };
}
