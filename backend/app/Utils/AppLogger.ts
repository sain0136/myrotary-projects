import { CustomErrorType } from "./CommonTypes";
import Application from "@ioc:Adonis/Core/Application";
import Env from "@ioc:Adonis/Core/Env";
const pino = require("pino");
import { Logger } from "pino";
import Mail from "@ioc:Adonis/Addons/Mail";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import Users from "App/Models/Users";
import { IUser } from "App/Shared/Interfaces/IUser";

type acceptedLogFormTypes = CustomErrorType | IUser | Users | genericLogData;
type outcome = "success" | "fail"; // could be a boolean, but I like the readability

type genericLogData = {
  status: "success" | "failed";
  message: string;
  event?: string;
};

interface logDataForm {
  uniqueId: string;
  type: any; // TODO - Define types here?
  timeStamp: string;
  event: string;
  status: string;
  source: string;
  target: string;
  message: string;
  customMessage: string;
}

const defaultLog: logDataForm = {
  uniqueId: "",
  type: "exception_error",
  timeStamp: "",
  event: "exception_error",
  status: "not found",
  source: "",
  target: "",
  message: "",
  customMessage: "",
};
//Wrapping this in a namespace to make exports easier. This way we have all we need to use the log system inside of here
//No need to guess what you have to import
export namespace LogTools {
  export enum UserAccessEvent {
    LOGIN = "login",
    LOGOUT = "logout",
  }

  export enum UserEditEvent {
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete",
  }

  export enum LogTypes {
    EXCEPTION_ERROR = "exception_error",
    DATABASE_ERROR = "database_error",
    ACCESS_LOG = "access_log",
    USER_LOG = "user_log",
    CUSTOM_LOG = "custom_log",
  }
}
const senderEmail = Env.get("SMTP_SENDER_ADDRESS");
const receiverEmail = Env.get("SMTP_RECEIVER_ADDRESS");
const environment = Env.get("NODE_ENV");
const destination =
  environment === "development"
    ? Application.makePath("dev_log.log")
    : Env.get("LOGS_PATH");
console.log("destination for log file", destination);
const errorFile =
  environment === "development"
    ? Application.makePath("appLoggerErrorsDev.txt")
    : Application.makePath("appLoggerErrors.txt"); // TODO - change this to an env variable
const fileExtension = environment === "development" ? "ts" : "js";
const pathToTransport = Application.makePath(
  `app/Utils/customTransport.${fileExtension}`
);

/*
 * Handles logger errors by appending the error data to the error file and sending an email notification.
 *
 * @param {string} [data] - The error data to be appended to the error file. If not provided, a default message is used.
 * @return {Promise<void>} A promise that resolves when the error handling is complete.
 */
async function handleLoggerErrors(data?: string): Promise<void> {
  const mssg =
    "\nALERT ALERT! ApiLogger Errors File created. Logging all errors related to appLogger";
  const toWrite = data ? mssg + ":" + data : "NO ERROR DATA FAILURE";
  try {
    await fs.appendFile(errorFile, toWrite);
    console.log("Successfully wrote to file");
  } catch (err) {
    console.error("An error occurred:", err);
    //TODO Consider adding more robust error handling here
  }
  try {
    // Send an email notification to the admin if an error occurs
    await Mail.sendLater((message) => {
      message
        .from(senderEmail)
        .to(receiverEmail)
        .replyTo(senderEmail)
        .subject("App Logger errror")
        .html(
          "Check Log File for AppLogger Error Logs are not writing correct"
        );
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

//Interfaces for each log type (containing all the info we need to gather for each log type)

interface ExceptionAndDatabaseLogParams {
  error: CustomErrorType;
  customMessage?: string;
}

interface AcessLogParams {
  sourceUser: IUser | Users | null;
  event: LogTools.UserAccessEvent;
  outcome: outcome;
  errorMessage: string | null;
  customMessage?: string;
}

interface UserLogParams {
  sourceUser: IUser | Users | null;
  targetUser: IUser | Users | null;
  event: LogTools.UserEditEvent;
  outcome: outcome;
  errorMessage: string | null;
  customMessage?: string;
}

interface CustomLogParams {
  type: string;
  event?: string;
  status?: string;
  source?: string;
  target?: string;
  message?: string;
  customMessage?: string;
}

export class LogManager {
  private logger: Logger = pino(makeTransport());

  //Function overload assures that the correct logData type is being passed for the correct log type

  //Overload Signatures
  log(
    type: LogTools.LogTypes.EXCEPTION_ERROR | LogTools.LogTypes.DATABASE_ERROR,
    params: ExceptionAndDatabaseLogParams
  ): void;
  log(type: LogTools.LogTypes.ACCESS_LOG, params: AcessLogParams): void;
  log(type: LogTools.LogTypes.USER_LOG, params: UserLogParams): void;
  log(type: LogTools.LogTypes.CUSTOM_LOG, params: CustomLogParams): void;

  //Overload implementation
  // replace any for the accepted interfaces?
  async log(type: LogTools.LogTypes, params: any) {
    // TODO - Check if async keyword needs to be present on the signatures too
    try {
      await confirmErrorLogFile(); // TODO - Check if this is necessary
      switch (type) {
        case LogTools.LogTypes.EXCEPTION_ERROR:
        case LogTools.LogTypes.DATABASE_ERROR:
          this.ExceptionAndDatabaseErrorLogHandler(type, params);
          break;
        case LogTools.LogTypes.ACCESS_LOG:
          this.AccessLogHandler(params);
          break;
        case LogTools.LogTypes.USER_LOG:
          this.UserLogHandler(params);
          break;
        case LogTools.LogTypes.CUSTOM_LOG:
          this.CustomLogHandler(params);
      }
    } catch (error) {
      handleError(error, null); //TODO - Handle this null, replace for the form data?
    }
  }

  //Base log for every log data form
  private createBaseLog(): logDataForm {
    return {
      ...defaultLog,
      timeStamp: new Date().toISOString(),
      uniqueId: uuidv4(),
    };
  }

  // Log Handler Implementations
  private ExceptionAndDatabaseErrorLogHandler(
    type: LogTools.LogTypes.EXCEPTION_ERROR | LogTools.LogTypes.DATABASE_ERROR,
    params: ExceptionAndDatabaseLogParams
  ) {
    const log: logDataForm = this.createBaseLog();
    LogTools.LogTypes.EXCEPTION_ERROR;
    log.type =
      type === LogTools.LogTypes.EXCEPTION_ERROR
        ? "exception_error"
        : "database_error";
    log.event =
      type === LogTools.LogTypes.EXCEPTION_ERROR
        ? "exception_error"
        : "database_error";
    log.status = "system error";
    log.message =
      type === LogTools.LogTypes.EXCEPTION_ERROR
        ? params.error.message
        : params.error.sqlMessage ?? params.error.message;
    log.customMessage = params.customMessage ?? "";
    this.logger.error({ rotaryLog: log });
  }

  private AccessLogHandler(params: AcessLogParams) {
    const log: logDataForm = this.createBaseLog();
    log.type = "access_log";
    log.target = "system";
    log.event = params.event;
    log.source =
      params.outcome === "success" && params.sourceUser
        ? params.sourceUser.fullName
        : " ";
    log.status = params.outcome;
    params.errorMessage = !params.errorMessage
      ? "No error message provided"
      : params.errorMessage;
    switch (params.event) {
      case LogTools.UserAccessEvent.LOGIN:
        log.message =
          params.outcome === "success" && params.sourceUser
            ? `${params.sourceUser.fullName} logged IN sucessfully with email ${params.sourceUser.email}`
            : `LOGIN failed, error: ${params.errorMessage}`;
        break;
      case LogTools.UserAccessEvent.LOGOUT:
        if (params.outcome === "success" && params.sourceUser) {
          log.message = `${params.sourceUser.fullName} logged OUT successfully with email ${params.sourceUser.email}`;
        } else {
          // Check if logData is not null to include user name in the failed message
          log.message = params.sourceUser
            ? `LOGOUT failed for ${params.sourceUser.fullName}, error: ${params.errorMessage}`
            : `LOGOUT failed, error: ${params.errorMessage}`;
        }
        break;
    }
    log.customMessage = params.customMessage ?? "";
    //Execute log
    this.logger.info({ rotaryLog: log });
  }

  private UserLogHandler(params: UserLogParams) {
    const log: logDataForm = this.createBaseLog();
    log.type = "user_log";
    log.event = params.event;
    log.status = params.outcome;
    log.source = params.sourceUser
      ? params.sourceUser.fullName // change to userId?
      : "No source user provided";
    log.target = params.targetUser
      ? params.targetUser.fullName // change to userId?
      : "No target user provided";
    log.message === params.errorMessage
      ? `Error: ${params.errorMessage}`
      : "No error message provided";
    log.customMessage = params.customMessage ?? "";
    this.logger.info({ rotaryLog: log });
  }

  private CustomLogHandler(params: CustomLogParams) {
    const log: logDataForm = this.createBaseLog();
    log.type = "user_log";
    log.event = params.event ?? "";
    log.status = params.status ?? "";
    log.source = params.source ?? "";
    log.target = params.target ?? "";
    log.message = params.message ?? "";
    log.customMessage = params.customMessage ?? "";
    this.logger.info({ rotaryLog: log });
  }
}

function makeTransport() {
  const transport = pino.transport({
    targets: [
      {
        level: "info",
        target: pathToTransport, // replace with the path to your transport file or func
        options: { destination: destination }, // replace with the path to your log file
      },
    ],
  });
  transport.on("error", (err: unknown) => {
    console.error("error caught", err);
  });
  return transport;
}

async function handleError(error: any, logData: acceptedLogFormTypes | null) {
  console.log(error);
  const extraData = JSON.stringify({
    message: error.message,
    destination: destination,
    pathToTransport: pathToTransport,
    ...logData,
  });
  await handleLoggerErrors(extraData);
}

async function confirmErrorLogFile() {
  try {
    console.log(`Attempting to open file: ${errorFile}`);
    const fileHandle = await fs.open(errorFile, 'r');
    console.log("File exists and is accessible.");
    await fileHandle.close();
  } catch (error) {
    console.error("File does not exist or cannot be accessed:", error);
    await handleLoggerErrors();
  }
}
