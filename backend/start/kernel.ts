import Server from "@ioc:Adonis/Core/Server";

import Env from "@ioc:Adonis/Core/Env";
import cron from "node-cron";
import { LogManager, LogTools } from "App/Utils/AppLogger";
import Session from "App/Models/Session";
import { DateTime } from "luxon";
const appLogger = new LogManager();
/*
|--------------------------------------------------------------------------
| Cron job for session cleanup
|--------------------------------------------------------------------------
| This cron job runs every 2 minutes in development and every hour in
| production. It deletes all sessions that have not been active for 30
| minutes.
|
*/
const cronString =
  Env.get("NODE_ENV") === "development"
    ? { pattern: "*/2 * * * *", desc: "every 2 minutes" }
    : { pattern: "0 */6 * * *", desc: "every 6 hours" };

cron.schedule(cronString.pattern, async () => {
  try {
    const allSessions = await Session.all();
    for (const session of allSessions) {
      const lastActivityTimestamp = DateTime.fromMillis(
        Number(session.lastActivityTimestamp)
      );
      const lastActivityTimestampThreshold = lastActivityTimestamp.plus({
        minutes: 30,
      });
      if (lastActivityTimestampThreshold < DateTime.now()) {
        appLogger.log(LogTools.LogTypes.CUSTOM_LOG, {
          type: LogTools.LogTypes.SESSION_CLEANUP,
          event: LogTools.UserEditEvent.CREATE,
          source: LogTools.Sources.SYSTEM,
          status: LogTools.Status.SUCCESS,
          message: "Session JSON\n" + JSON.stringify(session),
          customMessage:
            "Session deleted from backend due to inactivity. (We record these becasue this should be an edge case)",
        });
        await session.delete();
      }
    }
  } catch (error) {
    console.log("Error in cleanup", error);
  }
});

/*
|--------------------------------------------------------------------------
| Application middleware
|--------------------------------------------------------------------------
|
| This file main focus is used to define middleware for HTTP requests. You can register
| middleware as a `closure` or an IoC container binding. The bindings are
| preferred, since they keep this file clean.
|
*/

/*
|--------------------------------------------------------------------------
| Global middleware
|--------------------------------------------------------------------------
|
| An array of global middleware, that will be executed in the order they
| are defined for every HTTP requests.
|
*/
Server.middleware.register([
  () => import("@ioc:Adonis/Core/BodyParser"),
  () => import("App/Middleware/ErrorHandler"),
  () => import("App/Middleware/Authorize"),
]);

/*
|--------------------------------------------------------------------------
| Named middleware
|--------------------------------------------------------------------------
|
| Named middleware are defined as key-value pair. The value is the namespace
| or middleware function and key is the alias. Later you can use these
| alias on individual routes. For example:
|
| { auth: () => import('App/Middleware/Auth') }
|
| and then use it as follows
|
| 
|
*/
Server.middleware.registerNamed({});
