export interface ICustomError {
  statusCode: number | string;
  translatedMessage: translations;
  message?: string;
}

type lang = "en" | "fr";

type translations = {
  [key in lang]: string;
};
