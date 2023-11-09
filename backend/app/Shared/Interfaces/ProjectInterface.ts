import { IUser } from "App/Shared/Interfaces/IUser";

export interface IProjectDetails {
  creatorData: {
    fullName: string;
    email: string;
    phone: string;
    clubName: string;
  };
  districtClubData: { clubName: string; district_name: string };
  projectAdmins: Array<IUser>;
}
