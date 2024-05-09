import { CustomErrorType, defaultLog } from "./CommonTypes";
import Application from "@ioc:Adonis/Core/Application";
import Env from "@ioc:Adonis/Core/Env";
import type {
  genericLogData,
  logDataForm,
  typeOfLog,
} from "App/Utils/CommonTypes";
const pino = require("pino");
import { Logger } from "pino";
import Mail from "@ioc:Adonis/Addons/Mail";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import Users from "App/Models/Users";

type acceptedLogFormTypes = CustomErrorType | Users | genericLogData;
type outcome = "success" | "fail" // could be a boolean, but I like the readability

//Wrapping this in a namespace to make exports easier. This way we have all we need to use the log system inside of here
//No need to guess what you have to import
export namespace LogTools {
  export enum UserAccessEvent {
    LOGIN= "login",
    LOGOUT= "logout"
  }
  export enum LogTypes {
    EXCEPTION_ERROR= "exception_error",
    DATABASE_ERROR= "database_error",
    ACCESS_LOG= "access_log",
    USER_LOG= "user_log"
  }

  //Function overload assures that the correct logData type is being passed for the correct log type
export function appLoggerNew(type: LogTools.LogTypes.EXCEPTION_ERROR | LogTools.LogTypes.DATABASE_ERROR, logData: CustomErrorType)
export function appLoggerNew(type: LogTools.LogTypes.ACCESS_LOG, logData: Users | null, event: LogTools.UserAccessEvent, outcome: outcome, errorMessage?:string)
export function appLoggerNew(type: LogTools.LogTypes.USER_LOG, logData: genericLogData, outcome: outcome, errorMessage?: string)


export async function appLoggerNew(
  type: typeOfLog,
  logData: acceptedLogFormTypes | null,
  event?: any,
  outcome?: any,
  errorMessage?: any
  ) 
  {
  try{
  //  First confirm that the error log file exists,  If it doesn't exist, create it
  await confirmErrorLogFile();
  //  Create the pino logger
  const pinoLogger = pino(makeTransport());
  // create an logHandler instance based on the log type
  const logHandler = logHandlerFactory(type);
  //Handle the log
  switch(type){
    case ("exception_error" || "database_error"):
      logHandler.handleLog(logData,pinoLogger);
      break;
    case ("access_log"):
      console.log(`BEFORE: Event: ${event}. Outcome: ${outcome}. Error Message: ${errorMessage}`)
      logHandler.handleLog(logData,pinoLogger,outcome,errorMessage, event)
      break;
    case ("user_log"):
      logHandler.handleLog(logData,pinoLogger,outcome,errorMessage)
      break;
  }
  } catch (error) {
    handleError(error, logData);
  }
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
    ? "appLoggerErrorsDev.txt"
    : "appLoggerErrors.txt";
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
  const toWrite =
    (data ||
      "ApiLogger Errors File created. Logging all errors related to appLogger") +
    "\n";
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

//Base log for every log data form
function createBaseLog():logDataForm{
  return{
    ...defaultLog,
    timeStamp: new Date().toISOString(),
    uniqueId: uuidv4()
  }
}

//Refactor this? What if we have a new type of log that has only 3 properties: logData, logger, And then something else other than an outcome, errorMessage or event? What happens then?
interface ILogHandler {
  handleLog(logData: acceptedLogFormTypes | null, logger: Logger, outcome?:outcome, errorMessage?: string, event?: LogTools.UserAccessEvent): void;
}


class ExceptionErrorLogHandler implements ILogHandler{
  handleLog(logData: CustomErrorType, logger: Logger): void {
    const log: logDataForm = createBaseLog()
    log.type = 'exception_error'
    log.event = "exception_error"
    log.status = "system error"
    log.message = logData.message
    logger.error({ rotaryLog: log })
  }
}

class DatabaseErrorLogHandler implements ILogHandler{
  handleLog(logData: CustomErrorType, logger: Logger): void {
    const log: logDataForm = createBaseLog()
    log.type = 'database_error'
    log.event = "database_error"
    log.status = "system error"
    log.message =
      logData.sqlMessage ??
      logData.message
    logger.error({ rotaryLog: log });
  }
}

//TODO - How to handle login fail? Should we enforce that the e-mail used to log in is passed into this function?
class AccessLogHandler implements ILogHandler{
  handleLog(logData: Users | null, logger: Logger, outcome: outcome, errorMessage: string, event: LogTools.UserAccessEvent): void { //Should this error message be of type any? How do I know what's coming?
    const log: logDataForm = createBaseLog()
    log.type = 'access_log'
    log.target = "system"
    log.event = event
    log.source = outcome === 'success' && logData ? logData.fullName : " "
    log.status = outcome
    errorMessage = !errorMessage ? "No error message provided" : errorMessage
    switch(event){
      case LogTools.UserAccessEvent.LOGIN:
        log.message = outcome === 'success' && logData ? `${logData.fullName} logged IN sucessfully with email ${logData.email}` : `LOGIN failed, error: ${errorMessage}` 
        break;
      case LogTools.UserAccessEvent.LOGOUT:
        if (outcome === 'success' && logData) {
          log.message = `${logData.fullName} logged OUT successfully with email ${logData.email}`;
        } else {
          // Check if logData is not null to include user name in the failed message
          log.message = logData ? `LOGOUT failed for ${logData.fullName}, error: ${errorMessage}` : `LOGOUT failed, error: ${errorMessage}`;
        }
        break;
    }
    //Execute log
    logger.info({ rotaryLog: log })
  }
}

//Used when updating user info
// TODO - Add user obj as a property
// TODO - Ask Seb what we should be looking for in this log?
class UserLogHandler implements ILogHandler{
  handleLog(logData:genericLogData, logger:Logger, outcome: outcome, errorMessage: string){ //Should this error message be of type any? How do I know what's coming?
    const log: logDataForm = createBaseLog()
    log.event = "user_log"
    log.status = logData.status.toString()
    log.source = "system"
    log.target = "system"
    log.message = logData.message
    logger.info({ rotaryLog: log })
  }
}

function logHandlerFactory(type: typeOfLog): ILogHandler {
  switch (type) {
    case LogTools.LogTypes.EXCEPTION_ERROR:
      return new ExceptionErrorLogHandler()
    case LogTools.LogTypes.DATABASE_ERROR:
      return new DatabaseErrorLogHandler()
    case LogTools.LogTypes.ACCESS_LOG:
      return new AccessLogHandler()
    case LogTools.LogTypes.USER_LOG:
      return new UserLogHandler()
    default:
      throw new Error(`No handler found for type: ${type}`)
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

async function handleError(
  error: any,
  logData: acceptedLogFormTypes | null
) {
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
    await fs.access(errorFile);
  } catch {
    await handleLoggerErrors();
  }
}
