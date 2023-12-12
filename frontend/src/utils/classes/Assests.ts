import type {
  IAssets,
  IContentManagement,
  databaseTarget,
  uploadedFiletypes,
} from "@/utils/interfaces/IAssets";
import type { uploadedFile } from "@/utils/types/commonTypes";

export class Assets implements IAssets {
  id = 0;
  dm_initial = 0;
  dsg_intial = 0;
  club_intial = 0;
  global_intial = 0;
  assets = {
    main_logo: {
      s3UrlLink: "",
      s3Name: "",
      s3BaseUrlLink: "",
      fileType: "main-logo" as uploadedFiletypes,
      databaseTarget: "assets" as databaseTarget,
    } as uploadedFile,
    contentManagement: {
      myRotaryEmail: {
        en: "",
        fr: "",
      },
      myRotaryPhone: {
        en: "",
        fr: "",
      },
      myRotaryAddress: {
        en: "",
        fr: "",
      },
      myRotaryCountry: {
        en: "",
        fr: "",
      },
      myRotaryCity: {
        en: "",
        fr: "",
      },
      myRotaryPostalCode: {
        en: "",
        fr: "",
      },
      myRotaryProvince: {
        en: "",
        fr: "",
      },
      myRotaryAbout: {
        en: "",
        fr: "",
      },
      myRotaryAdminFullName: {
        en: "",
        fr: "",
      },
      myRotaryAdminEmail: {
        en: "",
        fr: "",
      },
      myRotaryfooterDescription: {
        en: "",
        fr: "",
      },
      faceboolUrl: {
        en: "",
        fr: "",
      },
      twitterUrl: {
        en: "",
        fr: "",
      },
      instagramUrl: {
        en: "",
        fr: "",
      },
    } as IContentManagement,
  };
}
