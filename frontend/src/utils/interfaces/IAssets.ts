import type { uploadedFile } from "@/utils/types/commonTypes";

export interface IContentManagement {
  myRotaryEmail: string;
  myRotaryPhone: string;
  myRotaryAddress: string;
  myRotaryCountry: string;
  myRotaryCity: string;
  myRotaryPostalCode: string;
  myRotaryProvince: string;
  myRotaryAbout: string;
  myRotaryAdminFullName: string;
  myRotaryAdminEmail: string;
  myRotaryfooterDescription: string;
  FaceboolUrl: string;
  TwitterUrl: string;
  InstagramUrl: string;
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
    profilePicture?: uploadedFile;
    contentManagement: IContentManagement;
  };
  main_logo: uploadedFile;
}
