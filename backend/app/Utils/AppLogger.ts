import { CustomErrorType, loginLogData } from "./CommonTypes";
import Application from "@ioc:Adonis/Core/Application";
import Env from "@ioc:Adonis/Core/Env";
import type { typeOfLog } from "App/Utils/CommonTypes";
const pino = require("pino");
import { Logger } from "pino";
import Mail from "@ioc:Adonis/Addons/Mail";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";

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

export async function appLogger(
  type: "error" | "login",
  logData: CustomErrorType | loginLogData
) {
  try {
    await confirmErrorLogFile();
    const transport = makeTransport();
    const pinoLogger = pino(transport);
    return executeLogger(logData, type, pinoLogger);
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
  logData: CustomErrorType | loginLogData,
  type: string,
  pinoLogger: Logger
) {
  const logId = uuidv4();
  logData.timestamp = new Date().toISOString();
  let typeOfLog: typeOfLog = "unknown";
  switch (type) {
    case "error":
      if ((logData as CustomErrorType).sqlCode) {
        typeOfLog = "database_error";
      } else if ((logData as CustomErrorType).errno) {
        typeOfLog = "exception_error";
      }
      pinoLogger.error({ uniqueId: logId, typeOfLog, ...logData });
      break;
    case "login":
      if ((logData as loginLogData).type === "login") {
        typeOfLog = {
          type: "login",
          loginStatus: (logData as loginLogData).loginStatus,
        };
      }
      pinoLogger.info({ uniqueId: logId, typeOfLog, ...logData });
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
  logData: CustomErrorType | loginLogData
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
