import type {
  ClubRole,
  DistrictRole,
  UserType,
  databaseTarget,
  uploadedFiletypes,
} from "App/Shared/Types/commonTypes";

export interface IRoles {
  club_id?: number;
  club_role?: ClubRole;
  district_id?: number;
  district_role?: DistrictRole;
  role_id: number;
  user_id: number;
  created_at: string;
  updated_at: number;
}

export type uploadedFile = {
  databaseTarget: databaseTarget;
  fileType: uploadedFiletypes;
  s3UrlLink: string;
  s3Name: string;
  s3BaseUrlLink?: string;
};

export interface IExtraDetails {
  profilePicture?: uploadedFile;
  district_name?: string;
  subscription_end_date?: string;
}

export interface IUser {
  firstname: string;
  lastname: string;
  address: string;
  user_city: string;
  user_postal: string;
  user_province: string;
  user_country: string;
  phone: string;
  email: string;
  password: string;
  extra_details: IExtraDetails;
  club_id: number;
  district_id: number | null;
  user_type: UserType;
  user_id: number;
  is_prospect?: boolean;
  subscription_id?: string;
  // computed properties
  fullName: string;
  role: Array<IRoles>;
  // creation or etc properties
  [key: string]: any;
  role_type?: string;
}
