export type CustomErrorType = {
  message: string;
  status?: number;
  errno?: number;
  sqlMessage?: string;
  sqlCode?: string | number;
  code?: number | string;
  translatedMessage?: Translation;
  timestamp?: string | Date;
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

export type ProjectFilters = {
  current_page: number;
  limit: number;
  club_id: number;
  search_text: string;
  project_status: string;
  project_region: string;
  area_focus: string;
  rotary_year: string;
  district_id: number;
  grant_type: string;
};

export type Currency = {
  symbol: string;
  name: string;
  symbol_native: string;
  decimal_digits: number;
  rounding: number;
  code: string;
  name_plural: string;
};

export type Currencies = {
  [key: string]: Currency;
};

export type genericLogData = {
  status: "success" | "failed";
  message: string;
  event?:
    | "login"
    | "logout"
    | "exception_error"
    | "database_error"
    | "user_creation"
    | "user_update"
    | "user_deletion"
    | "user_log"
    | "mail_log"
    | "system";
};

export type typeOfLog =
  | "exception_error"
  | "database_error"
  | "access_log"
  | "user_log"
  | "mail_log"
  | { [key: string]: any };

export interface logDataForm {
  uniqueId: string;
  type: typeOfLog;
  timeStamp: string;
  event:
    | "login"
    | "logout"
    | "exception_error"
    | "database_error"
    | "user_creation"
    | "user_update"
    | "user_deletion"
    | "user_log"
    | "mail_log"
    | "system";
  status: "success" | "failed" | "system error" | "not found";
  source: string;
  target: "system" | "";
  message: string;
}

export const defaultLog: logDataForm = {
  uniqueId: "",
  type: "exception_error",
  event: "exception_error",
  status: "not found",
  source: "",
  target: "",
  message: "",
  timeStamp: "",
};
