import type { IAssets } from "../interfaces/IAssets";

export class Assets implements IAssets {
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
