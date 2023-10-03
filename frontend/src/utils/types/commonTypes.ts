import type { IClub } from "../interfaces/IClub";
import type { IDistrict } from "../interfaces/IDistrict";
import type { IUser } from "../interfaces/IUser";

export type theme = "primary" | "black" | "secondary";

export type DistrictRole =
  | "Webmaster"
  | "District Admin"
  | "District Grants Chair"
  | "District Foundations Chair"
  | "District International Chair";

export type ClubRole = " Club Admin" | "Standard Member" | "Guest";

export type UserType = "CLUB" | "DISTRICT";

export type storagePath = "./siteadmin";

export type databaseTarget = "assets" | "profile-picture";

export type uploadedFiletypes =
  | "profile-picture"
  | "main-logo"
  | "project-coverImage";

export type uploadFileData = {
  databaseTarget: databaseTarget;
  fileTypes: uploadedFiletypes;
  files: File[];
  storagePath: storagePath;
};

export type PaginationResult = {
  data: Array<IUser | IClub | IDistrict>;
  meta: {
    first_page: number;
    last_page: number;
    current_page: number;
    per_page: number;
    total: number;
  };
};
