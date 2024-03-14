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

const senderEmail = Env.get("SMTP_SENDER_ADDRESS");
const receiverEmail = Env.get("SMTP_RECEIVER_ADDRESS");
const environment = Env.get("NODE_ENV");
const destination =
  environment === "development"
    ? Application.makePath("dev_log.log")
    : Application.makePath("production_log.log");
const errorFile =
  environment === "development"
    ? "appLoggerErrorsDev.txt"
    : "appLoggerErrors.txt";
const fileExtension = environment === "development" ? "ts" : "js";
const pathToTransport = Application.makePath(
  `app/Utils/customTransport.${fileExtension}`
);

type acceptedTypes = CustomErrorType | Users | genericLogData;
export async function appLogger(type: typeOfLog, logData: acceptedTypes) {
  try {
    await confirmErrorLogFile();
    const transport = makeTransport();
    const pinoLogger = pino(transport);
    return executeLogger(type, logData, pinoLogger);
  } catch (error) {
    handleError(error, logData);
  }
}

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

function executeLogger(
  type: typeOfLog,
  logData: acceptedTypes,
  pinoLogger: Logger
) {
  const logId = uuidv4();
  let log: logDataForm = defaultLog;
  log.timeStamp = new Date().toISOString();
  log.uniqueId = logId;
  log.type = type;
  switch (type) {
    case "exception_error":
      log.event = "exception_error";
      log.status = "system error";
      log.message = (logData as CustomErrorType).message;
      pinoLogger.error({ rotaryLog: log });
      break;
    case "database_error":
      log.event = "database_error";
      log.status = "system error";
      log.message =
        (logData as CustomErrorType).sqlMessage ??
        (logData as CustomErrorType).message;
      pinoLogger.error({ rotaryLog: log });
      break;
    case "access_log":
      if ((logData as Users)?.userId || (logData as Users)?.email) {
        log.event = "login";
        log.status = "success";
        log.source = (logData as Users).fullName;
        log.target = "system";
        log.message = `${(logData as Users).fullName} logged in with email ${
          (logData as Users).email
        }`;
        pinoLogger.info({ rotaryLog: log });
      } else if ((logData as genericLogData)?.status === "success") {
        log.event = "logout";
        log.status = (logData as genericLogData).status;
        log.source = "";
        log.target = "system";
        log.message = (logData as genericLogData)
          ? (logData as genericLogData).message
          : `A user logged out`;
        pinoLogger.info({ rotaryLog: log });
      } else if ((logData as genericLogData)?.status === "failed") {
        log.event = "logout";
        log.status = (logData as genericLogData).status;
        log.source = "";
        log.target = "system";
        log.message = (logData as genericLogData)
          ? (logData as genericLogData).message
          : `A user failed to log out`;
        pinoLogger.info({ rotaryLog: log });
      }
      break;
    default:
      pinoLogger.error({ rotaryLog: log });
      break;
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
  logData: CustomErrorType | Users | genericLogData
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
