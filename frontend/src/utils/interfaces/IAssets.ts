import type { uploadedFile } from "@/utils/types/commonTypes";

export interface IContentManagement {
  myRotaryEmail: {
    en: string;
    fr: string;
  };
  myRotaryPhone: {
    en: string;
    fr: string;
  };
  myRotaryAddress: {
    en: string;
    fr: string;
  };
  myRotaryCountry: {
    en: string;
    fr: string;
  };
  myRotaryCity: {
    en: string;
    fr: string;
  };
  myRotaryPostalCode: {
    en: string;
    fr: string;
  };
  myRotaryProvince: {
    en: string;
    fr: string;
  };
  myRotaryAbout: {
    en: string;
    fr: string;
  };
  myRotaryAdminFullName: {
    en: string;
    fr: string;
  };
  myRotaryAdminEmail: {
    en: string;
    fr: string;
  };
  myRotaryfooterDescription: {
    en: string;
    fr: string;
  };
  faceboolUrl: {
    en: string;
    fr: string;
  };
  twitterUrl: {
    en: string;
    fr: string;
  };
  instagramUrl: {
    en: string;
    fr: string;
  };
}

export type databaseTarget = "assets" | "profile-picture";

export type uploadedFiletypes =
  | "main-logo"
  | "profile-picture"
  | "projectCoverImage";

export interface IAssets {
  id: number;
  dm_initial: number;
  dsg_intial: number;
  club_intial: number;
  global_intial: number;
  assets: {
    main_logo: uploadedFile;
    contentManagement: IContentManagement;
  };
}
