import type { IUser } from "@/utils/interfaces/IUser";
import type { IRoles } from "@/utils/interfaces/IUser";
import type { UserType } from "@/utils/types/commonTypes";

export default class User implements IUser {
  firstname = "";
  lastname = "";
  address = "";
  phone = "";
  user_city = "";
  user_country = "";
  user_postal = "";
  user_province = "";
  email = "";
  password = "";
  district_id = 0;
  club_id = 0;
  extra_userinformation = {};
  user_type = "DISTRICT" as UserType;
  fullName = "";
  role = [] as Array<IRoles>;
  role_type = "";
  extra_details = {};
  user_id = 0;

  constructor() {}
}
