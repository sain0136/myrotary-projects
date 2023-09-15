import { IUser } from "App/Shared/Interfaces/UserInterface";

export interface ProjectDetails {
  creatorData: {
    fullName: string;
    email: string;
    phone: string;
    clubName: string;
  };
  districtClubData: { clubName: string; district_name: string };
  projectAdmins: Array<IUser>;
}
