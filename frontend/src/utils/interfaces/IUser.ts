import type {
  ClubRole,
  DistrictRole,
  UserType,
  databaseTarget,
  uploadedFile,
  uploadedFiletypes,
} from "@/utils/types/commonTypes";

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

export interface IExtraDetails {
  profilePicture?: uploadedFile;
  district_name?: string;
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
  is_prospect?:boolean;
  // computed properties
  fullName: string;
  role: DistrictRole | ClubRole | string;
  // creation or etc properties
  [key: string]: any;
  role_type?: string;
}
