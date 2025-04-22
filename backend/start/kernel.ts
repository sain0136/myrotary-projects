import Server from "@ioc:Adonis/Core/Server";
import MailController from "App/Controllers/Http/MailController";
import Env from "@ioc:Adonis/Core/Env";
import cron from "node-cron";
import { LogManager, LogTools } from "App/Utils/AppLogger";
import Session from "App/Models/Session";
import { DateTime } from "luxon";
import Users from "App/Models/Users";
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
const seessionCronString =
  Env.get("NODE_ENV") === "development"
    ? { pattern: "*/2 * * * *", desc: "every 2 minutes" }
    : { pattern: "0 */6 * * *", desc: "every 6 hours" };

cron.schedule(seessionCronString.pattern, async () => {
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
| Cron job for prospective user account management
|--------------------------------------------------------------------------
| This cron job performs the following tasks:
| 1. Checks the age of prospective user accounts.
| 2. Automatically deletes user accounts inactive for 120 days, sending a
|    pre-deletion notification to the user before removal.
|
| This helps ensure timely follow-up on new accounts and keeps the user
| database clean.
*/

const prospectiveUserCronString =
  Env.get("NODE_ENV") === "development"
    ? { pattern: "*/2 * * * *", desc: "every 2 minutes" }
    : { pattern: "0 6 * * *", desc: "every day at 6am" };

cron.schedule(prospectiveUserCronString.pattern, async () => {
  try {
    const prospectiveUsers = await Users.query().where("is_prospect", true);
    for (const user of prospectiveUsers) {
      const createdDate = user.createdAt;
      const currentDate = DateTime.now();
      const diffInDays = currentDate.diff(createdDate, "days").days.toFixed(0);
      if (Number(diffInDays) > 120) {
        const mailController = new MailController();
        let mailBodyMessage = `Your account was created on ${createdDate.toFormat(
          "yyyy-MM-dd HH:mm:ss"
        )} and has not been approved yet. As a result, your account was deleted. If you are still interested in using our service, please register again.`;

        await mailController.sendMail({
          subject: "Prospective account deletion notice",
          receiverEmail: user.email,
          messageBody: {
            message: mailBodyMessage,
          },
        });
        await user.delete();
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
