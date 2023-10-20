import { DateTime } from "luxon";
import {
  BaseModel,
  HasMany,
  ManyToMany,
  column,
  computed,
  hasMany,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
// import { NonPlurizeNamingStrategy } from "Contracts/NonPlurizeNamingStrategy";
import Pledge from "./Pledges";
import Pledges from "./Pledges";
import Users from "./Users";

export default class Projects extends BaseModel {
  // public static namingStrategy = new NonPlurizeNamingStrategy();

  @computed()
  public pledgesAssociated: Array<Pledge> | [];

  @computed()
  public projectDetails: {};

  @column({ isPrimary: true })
  public projectId: number;

  @column()
  public projectName: string;

  @column()
  public grantType: string;

  @column()
  public projectStatus: string;

  @column()
  public projectNumber: number;

  @column()
  public projectCode: string;

  @column()
  public projectDescription: string;

  @column()
  public country: string;

  @column()
  public region: string;

  @column.date()
  public startDate: DateTime;

  @column.date()
  public completionDate: DateTime;

  @column()
  public areaFocus: object;

  @column()
  public fundingGoal: number;

  @column()
  public anticipatedFunding: number;

  @column()
  public intialSponsorClubContribution: number;

  @column()
  public coOperatingOrganisationContribution: number;

  @column()
  public districtSimplifiedGrantRequest: number;

  @column()
  public districtMatchingGrantRequest: number;

  @column()
  public totalPledges: number;

  @column()
  public currency: string;
  // Todo: Are these strings or objects will they be returned unseralized ?
  @column()
  public extraDescriptions: string;

  @column()
  public itemizedBudget: string;

  @column()
  public hostclubInformation: string;

  @column()
  public fileUploads: any;

  @column()
  public rotaryYear: string;

  @column()
  public imageLink: object;

  @column()
  public createdBy: number;

  @column()
  public clubId: number;

  @column()
  public districtId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => Pledges, { foreignKey: "projectId" })
  public pledges: HasMany<typeof Pledges>;

  @manyToMany(() => Users, {
    pivotTable: "project_roles",
    localKey: "projectId",
    relatedKey: "userId",
    pivotRelatedForeignKey: "user_id",
    pivotForeignKey: "project_id",
    pivotTimestamps: true,
  })
  public projectRole: ManyToMany<typeof Users>;
}
