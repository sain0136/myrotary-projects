export interface ICustomError {
  statusCode: number | string;
  translatedMessage: translations;
  message?: string;
  errorData?: { [key: string]: string | number } | undefined;
}

type lang = "en" | "fr";

type translations = {
  [key in lang]: string;
};
