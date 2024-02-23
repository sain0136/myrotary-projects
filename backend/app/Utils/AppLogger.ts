import Logger from "@ioc:Adonis/Core/Logger";
import { CustomErrorType, loginLogData } from "./CommonTypes";
type typeOfLog =
  | "exception_error"
  | "database_error"
  | "login"
  | "unknown"
  | { [key: string]: any };
export function appLogger(
  type: "error" | "login",
  logData: CustomErrorType | loginLogData | any
) {
  
  let typeOfLog: typeOfLog = "unknown";
  switch (type) {
    case "error":
      if ((logData as CustomErrorType).sqlCode) {
        typeOfLog = "database_error";
      } else if ((logData as CustomErrorType).errno) {
        typeOfLog = "exception_error";
      }
      Logger.error({ typeOfLog, ...logData });
      break;
    case "login":
      if ((logData as loginLogData).type === "login") {
        typeOfLog = {
          type: "login",
          loginStatus: (logData as loginLogData).loginStatus,
        };
      }
      Logger.info({ typeOfLog, ...logData });
  }
}
