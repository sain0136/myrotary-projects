export interface IEmail {
  senderEmail?: string;
  receiverEmail?: string;
  senderName?: string;
  subject: string;
  messageBody: {
    messageIntructions?: string;
    message: string;
    senderMeta?: boolean;
  };
}
