import type { IClub } from "@/utils/interfaces/IClub";
import type { IDistrict } from "@/utils/interfaces/IDistrict";
import type {
  IClubProject,
  IDmProject,
  IDsgProject,
} from "@/utils/interfaces/IProjects";
import type { IUser } from "@/utils/interfaces/IUser";

export type theme = "primary" | "black" | "secondary";

export type DistrictRole =
  | "Webmaster"
  | "District Admin"
  | "District Grants Chair"
  | "District Foundations Chair"
  | "District International Chair";

export type ClubRole = "Club Admin" | "Standard Member" | "Guest";

export type UserType = "CLUB" | "DISTRICT" | "SUPER";

export type storagePath =
  | "./siteadmin"
  | "./users"
  | "./projects"
  | "./districts";

export type databaseTarget =
  | "assets"
  | "profile-picture"
  | "profile-picture-user"
  | "project-media"
  | "district-report-files";

export type uploadedFiletypes =
  | "profile-picture"
  | "main-logo"
  | "project-coverImage"
  | "project-gallery"
  | "project-document-evidence"
  | "project-report-files"
  | "district-report-files";

export type uploadedFile = {
  databaseTarget: databaseTarget;
  fileType: uploadedFiletypes;
  s3UrlLink: string;
  s3Name: string;
  s3BaseUrlLink?: string;
};

export type uploadFileData = {
  databaseTarget: databaseTarget;
  fileTypes: uploadedFiletypes;
  files: File[];
  storagePath: storagePath;
};

export type ProjectFilters = {
  current_page: number;
  limit: number;
  club_id: number;
  search_text: string;
  project_status: string;
  project_region: string;
  area_focus: string;
  rotary_year: string;
  district_id: number;
  grant_type: string;
  reset?: boolean;
};

export type PaginationResult = {
  data: Array<
    IUser | IClub | IDistrict | IDmProject | IDsgProject | IClubProject
  >;
  meta: {
    first_page: number;
    last_page: number;
    current_page: number;
    per_page: number;
    total: number;
  };
};

export type GrantType =
  | "Club Project"
  | "District Simplified Project"
  | "District Matching Project"
  | "Global Project";

export const grantType = {
  CLUBPROJECT: "Club Project",
  DISTRICTSIMPLIFIEDPROJECT: "District Simplified Project",
  DISTRICTMATCHINGPROJECT: "District Matching Project",
  GLOBALPROJECT: "Global Project",
};

export const grantTypeFr = {
  CLUBPROJECT: "Projet de Club",
  DISTRICTSIMPLIFIEDPROJECT: "Projet Simplifié de District",
  DISTRICTMATCHINGPROJECT: "Projet d'Appariement de District",
  GLOBALPROJECT: "Projet Global",
};

export const projectStatus = {
  LOOKINGFORFUNDING: "Looking For Funding",
  FULLYFUNDED: "Fully Funded",
  PENDINGAPPROVAL: "Pending Approval",
  APPROVED: "Approved",
  REPORTSDUE: "Reports Due",
  COMPLETED: "Completed",
};

export type ProjectStatus =
  | "Looking For Funding"
  | "Fully Funded"
  | "Pending Approval"
  | "Approved"
  | "Reports Due"
  | "Completed";

export type IAreaOfFocus = {
  Peace_Conflict_Prevention: boolean;
  Disease_Prevention_And_Treatment: boolean;
  Water_And_Sanitation: boolean;
  Maternal_And_Child_Health: boolean;
  Basic_Education_And_Literacy: boolean;
  Economic_And_Community_Development: boolean;
  Environment: boolean;
};
