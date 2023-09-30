import type {
  IAssets,
  uploadedFile,
  databaseTarget,
  uploadedFiletypes,
} from "@/utils/interfaces/IAssets";

const dt: databaseTarget = "assets";
const at: uploadedFiletypes = "main-logo";
export class Assets implements IAssets {
  main_logo = {
    databaseTarget: dt,
    fileType: at,
    s3UrlLink: "",
    s3Name: "",
  };
  id = 0;
  dm_initial = 0;
  dsg_intial = 0;
  club_intial = 0;
  global_intial = 0;

  assets = {
    main_logo: {
      id: "",
      url: "",
      fileType: "",
      location: "",
    },
    contentManagement: {
      myRotaryEmail: "",
      myRotaryPhone: "",
      myRotaryAddress: "",
      myRotaryCountry: "",
      myRotaryCity: "",
      myRotaryPostalCode: "",
      myRotaryProvince: "",
      myRotaryAbout: "",
      myRotaryAdminFullName: "",
      myRotaryAdminEmail: "",
      myRotaryfooterDescription: "",
      FaceboolUrl: "",
      TwitterUrl: "",
      InstagramUrl: "",
    },
  };
}
