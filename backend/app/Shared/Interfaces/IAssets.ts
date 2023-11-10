import { uploadedFile } from "./IUser";

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

export interface IAssets {
  id: number;
  dm_initial: number;
  dsg_intial: number;
  club_intial: number;
  global_intial: number;
  assets: {
    main_logo: {
      id: string;
      url: string;
      fileType: string;
      location: string;
    };
    profilePicture?: uploadedFile;
    contentManagement: IContentManagement;
  };
  main_logo: uploadedFile;
}
