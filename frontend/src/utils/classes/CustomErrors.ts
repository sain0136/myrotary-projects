import type { ICustomError } from "@/utils/interfaces/ICustomError";

export class CustomErrors extends Error implements ICustomError {
  statusCode: number | string;
  rawMessage: string;
  translatedMessage: {
    en: string;
    fr: string;
  };

  constructor(
    statusCode: number | string,
    rawMessage: string,
    translatedMessage: {
      en: string;
      fr: string;
    }
  ) {
    super(rawMessage);
    this.statusCode = statusCode;
    this.rawMessage = rawMessage;
    this.translatedMessage = translatedMessage;
  }
}
