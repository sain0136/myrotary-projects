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

export type loginLogData = {
    type: "login" | "logout";
    loginStatus: "success" | "failed";
};