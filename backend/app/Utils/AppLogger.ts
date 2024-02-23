import { CustomErrorType, loginLogData } from "./CommonTypes";
import Application from "@ioc:Adonis/Core/Application";
import Env from "@ioc:Adonis/Core/Env";
const pino = require("pino");
const fs = require('fs');

const data = 'Hello, world!';

function writeTest() {
  fs.writeFile('example.txt', data, (err) => {
    if (err) {
      console.error('An error occurred:', err);
    } else {
      console.log('Successfully wrote to file');
    }
  });
}

type typeOfLog =
  | "exception_error"
  | "database_error"
  | "login"
  | "unknown"
  | { [key: string]: any };

export async function appLogger(
  type: "error" | "login",
  logData: CustomErrorType | loginLogData | any
) {
  try {
    writeTest();
    logData.timestamp = new Date().toISOString();
    let typeOfLog: typeOfLog = "unknown";
    const environment = Env.get("NODE_ENV");
    const destination =
      environment === "development"
        ? Application.makePath("dev_app.log")
        : Application.makePath("pro_log.log");

    const transport = pino.transport({
      targets: [
        {
          level: "info",
          target: Application.makePath("my-transport.mjs"), // replace with the path to your transport file
          options: { destination: destination }, // replace with the path to your log file
        },
      ],
    });
    transport.on('error', err => {
      console.error('error caught', err)
    })
    const logger = pino(transport);
    switch (type) {
      case "error":
        if ((logData as CustomErrorType).sqlCode) {
          typeOfLog = "database_error";
        } else if ((logData as CustomErrorType).errno) {
          typeOfLog = "exception_error";
        }
        logger.error({ typeOfLog, ...logData });
        break;
      case "login":
        if ((logData as loginLogData).type === "login") {
          typeOfLog = {
            type: "login",
            loginStatus: (logData as loginLogData).loginStatus,
          };
        }
        logger.info({ typeOfLog, ...logData });
    }
    return { loginfo: { destination, typeOfLog, ...logData } };
  } catch (error) {
    console.log(error);
  }
}
