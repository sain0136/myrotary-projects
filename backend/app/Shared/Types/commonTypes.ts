interface File {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

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

export const ProjectStatus = {
  LOOKINGFORFUNDING: "Looking For Funding",
  FULLYFUNDED: "Fully Funded",
  PENDINGAPPROVAL: "Pending Approval",
  APPROVED: "Approved",
  REPORTSDUE: "Reports Due",
  COMPLETED: "Completed",
};
