import { DateTime } from "luxon";
import { BaseModel, beforeCreate, column } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";

export default class Session extends BaseModel {
  @column({ isPrimary: true })
  public sessionId: string;

  @beforeCreate()
  public static assignUuid(session: Session) {
    session.sessionId = uuidv4();
  }

  @column()
  public userId: number;

  @column()
  public loginTimestamp: bigint;

  @column()
  public lastActivityTimestamp: bigint;

  @column()
  public fullName: string;

  @column()
  public email: string;

  @column()
  public details: string | object;

  @column()
  public districtId: number;

  @column()
  public clubId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
