export interface ICustomError {
    statusCode : number | string;
    rawMessage : string;
    translatedMessage : translations 
}

type lang = 'en' | 'fr'

type translations = {
  [key in lang]: string;
};
  