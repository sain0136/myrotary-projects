// ...existing code...
import fs from "fs";
import path from "path";
import Env from "@ioc:Adonis/Core/Env";
import Logger from "@ioc:Adonis/Core/Logger";

const LOGS_PATH = Env.get("LOGS_PATH") || path.join(__dirname, "../../");
const LOG_FILE = path.join(LOGS_PATH, "rotary.log");

// Placeholder for handling missing/inaccessible log folder

// Ensure log folder exists and is writable
try {
  if (!fs.existsSync(LOGS_PATH)) {
    throw new Error(`Log folder does not exist: ${LOGS_PATH}`);
  }
  fs.accessSync(LOGS_PATH, fs.constants.W_OK);
  // If folder exists but file does not, create the file
  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, "");
  }
} catch (err) {
  Logger.info(
    "Unable to create/access log file with path {LOG_FILE}:",
    LOG_FILE,
    err
  );
  console.error("Unable to create/access log file:", LOG_FILE, err);
}

type Allowed = "message" | "customMessage" | "details";

type Entry = { [key in Allowed]?: any } | string;
// Simple logger function
export function rotaryLogger(
  type: "INFO" | "ERROR" | "WARNING",
  entry: Entry | string,
  request: Record<string, any>,
  logError?: any
) {
  const base: any = {
    type,
    timestamp: new Date().toISOString(),
    route: request?.ctx?.routeKey || "",
    requestId: request.id() || "",
    message: "",
    customMessage: "",
    details: {},
  };
  if (typeof entry === "string") {
    base.message = entry;
  } else {
    Object.assign(base, entry);
    if (logError) {
      base.error = {
        errorMessage: logError.message,
        stack: logError.stack,
      };
    }
  }

  fs.appendFile(LOG_FILE, JSON.stringify(base) + "\n", (err) => {
    if (err) {
      // Optionally handle write errors here
    }
  });
}

export default rotaryLogger;
