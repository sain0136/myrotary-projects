import type { ICustomError } from "@/utils/interfaces/ICustomError";

export class CustomErrors extends Error implements ICustomError {
  statusCode: number | string;
  translatedMessage: {
    en: string;
    fr: string;
  };

  constructor(
    statusCode: number | string,
    translatedMessage: {
      en: string;
      fr: string;
    }
  ) {
    super(translatedMessage.en);
    this.statusCode = statusCode;
    this.translatedMessage = translatedMessage;
  }
}
