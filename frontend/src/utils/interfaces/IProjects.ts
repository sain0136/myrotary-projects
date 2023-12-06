import type { IUser } from "@/utils/interfaces/IUser";
import type { IPledge } from "@/utils/interfaces/IPledge";
import type { uploadFileData, uploadedFile } from "@/utils/types/commonTypes";

// common
interface IContactSection {
  address: string;
  email: string;
  cell: string;
  name: string;
  phone: string;
}
export interface IFundingSource {
  sourceName: string;
  typeOfFunding: string;
  amount: number;
}
// Host Club Info
interface ISectionC {
  cooperating_organizations: Array<ICoopOrganization>;
  cooperating_organizations_roles_description: string;
  cooperating_organizations_identify_members: string;
}

interface ISectionF {
  local_currency_name: string;
  exchange_rate: string;
}

// sec C sub
interface ICoopOrganization {
  organization_name: string;
  address: string;
  contact_person: IContactSection;
  website_address: string;
}
// Extra desc
interface ISectionD {
  community_benefit: string;
  project_accountability: string;
  ownership_project: string;
  inventory_project: string;
  customs_clearance: string;
}

interface ISectionE {
  project_capacity: string;
  project_sustainment: string;
  e: ISectionSurvey;
}

// sect e sub
interface ISectionSurvey {
  Surveys: boolean;
  Questionnaires: boolean;
  Observations: boolean;
  Tests_Of_Knowledge: boolean;
  Interviews: boolean;
  Focus_Groups: boolean;
  Video_Media: boolean;
  Documents_Materials_Collections: boolean;
}
// main
export interface IHostclubInformation {
  host_club_name: string;
  district_number: string;
  district_country: string;
  location_city: string;
  location_country: string;
  location_community: string;
  host_primary_contact: IContactSection;
  listOfObjectives: Array<string>;
  host_sponsor_planned_project_description: string;
  host_commit_description: string;
  international_commit_description: string;
  sponsor_publicize_description: string;
  sectionC: ISectionC;
  sectionF: ISectionF;
}

export interface IExtraDescriptions {
  other_club_contribution: number;
  other_sources: number;
  fundingSourceArray: Array<IFundingSource>;
  benefit_community_description: string;
  co_operating_organisation_letter: string;
  non_financial_participation: string;
  primary_contact: IContactSection;
  secondary_contact: IContactSection;
  sectionD: ISectionD;
  sectionE: ISectionE;
}

export interface IBudgetItem {
  itemCost: number;
  itemName: string;
  supplierName?: string;
  itemCostLocalCurrency?: number;
}

export interface IClubProjectExtraDescriptions {
  extra: string;
}

export interface IDistrictOrClubInformation {
  fundingSourceArray?: [];
  clubName: string;
  district_name: string;
}

export interface ICreatorInformation {
  fullName: string;
  email: string;
  phone: string;
  clubName: string;
}

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

export interface IUploads {
  project_image: uploadFileData | uploadedFile;
  reports_files: Array<uploadFileData | uploadedFile>;
  evidence_files: Array<uploadFileData | uploadedFile>;
  project_gallery?: Array<uploadFileData | uploadedFile>;
}

export interface IGenericProject {
  project_id: number;
  project_name: string;
  grant_type: string;
  project_status: string;
  project_number: number;
  project_code: string;
  project_description: string;
  country: string;
  region: string;
  start_date: string;
  completion_date: string;
  area_focus: {
    Peace_Conflict_Prevention: boolean;
    Disease_Prevention_And_Treatment: boolean;
    Water_And_Sanitation: boolean;
    Maternal_And_Child_Health: boolean;
    Basic_Education_And_Literacy: boolean;
    Economic_And_Community_Development: boolean;
    Environment: boolean;
  };
  funding_goal: number;
  anticipated_funding: number;
  total_pledges: number;
  file_uploads: IUploads;
  rotary_year: string;
  image_link: uploadFileData;
  created_by: number;
  club_id: number;
  district_id: number;
  // creation or update properties
  image?: any;
  file?: any;
  mulitFile?: Array<any>;
  // computed return properties
  pledgesAssociated: Array<IPledge>;
  projectDetails: IProjectDetails;
}

export interface IClubProject extends IGenericProject {
  extra_descriptions: IClubProjectExtraDescriptions;
}

export interface ClubProjectExtraDescriptions {
  extra: string;
}

export interface IDsgProject extends IGenericProject {
  co_operating_organisation_contribution: number;
  district_simplified_grant_request: number;
  intial_sponsor_club_contribution: number;
  itemized_budget: Array<IBudgetItem>;
  extra_descriptions: IExtraDescriptions;
}

export interface IDmProject extends IGenericProject, IDsgProject {
  hostclub_information: IHostclubInformation;
  district_matching_grant_request: number;
}

export interface IGlobalProject
  extends IGenericProject,
    IDsgProject,
    IDmProject {}
