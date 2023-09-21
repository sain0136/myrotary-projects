export type CustomErrorType = {
  message: string;
  status?: number;
  errno?: number;
  sqlMessage?: string;
  sqlCode?: string | number;
  code?: number | string;
  translatedMessage?: Translation;
};

export type Translation = {
  en: string;
  fr: string;
};

export type DatabaseError = {
  en: string;
  fr: string;
};

export type AuthenticationRequestData = {
  email: string;
  password: string;
  webAdmin?: boolean;
};
