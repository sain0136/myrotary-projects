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
  public projectDetails:  {};

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
  public region: String;

  @column.date()
  public startDate: DateTime;

  @column.date()
  public completionDate: DateTime;

  @column({
    consume: (value: string | null) => {
      if (value) {
        return JSON.parse(value);
      }
      return null;
    },
  })
  public areaFocus: object;

  @column({
    consume: (value: string) => {
      if (value) {
        return parseFloat(value);
      }
      return null; // added for null value was not here before
    },
  })
  public fundingGoal: number;

  @column({
    consume: (value: string) => {
      if (value) {
        return parseFloat(value);
      }
      return null;
    },
  })
  public anticipatedFunding: number;

  @column({
    consume: (value: string) => {
      if (value) {
        return parseFloat(value);
      }
      return null;
    },
  })
  public intialSponsorClubContribution: number;

  @column({
    consume: (value: string) => {
      if (value) {
        return parseFloat(value);
      }
      return null;
    },
  })
  public coOperatingOrganisationContribution: number;

  @column({
    consume: (value: string) => {
      if (value) {
        return parseFloat(value);
      }
      return null;
    },
  })
  public districtSimplifiedGrantRequest: number;

  @column({
    consume: (value: string) => {
      if (value) {
        return parseFloat(value);
      }
      return null;
    },
  })
  public districtMatchingGrantRequest: number;

  @column({
    consume: (value: string) => {
      if (value) {
        return parseFloat(value);
      }
      return null;
    },
  })
  public totalPledges: number;


  @column()
  public currency: string;

  @column({
    consume: (value: string | null) => {
      if (value) {
        return JSON.parse(value);
      }
      return null;
    },
  })
  public extraDescriptions: object;

  @column({
    consume: (value: string | null) => {
      if (value) {
        return JSON.parse(value);
      }
      return null;
    },
  })
  public itemizedBudget: object;

  @column({
    consume: (value: string | null) => {
      if (value) {
        return JSON.parse(value);
      }
      return null;
    },
  })
  public hostclubInformation: object;

  @column({
    consume: (value: string | null) => {
      if (value) {
        return JSON.parse(value);
      }
      return null;
    },
  })
  public fileUploads: any;

  @column()
  public rotaryYear: string;

  @column({
    serialize: (value: string | null) => {
      if (value) {
        return JSON.parse(value);
      }
    },
  })
  public imageLink: string;

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
