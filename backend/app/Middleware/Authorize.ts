import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DateTime } from "luxon";
import CustomException from "App/Exceptions/CustomException";
import Session from "App/Models/Session";
import { appLogger } from "App/Utils/AppLogger";
import { genericLogData } from "App/Utils/CommonTypes";

export default class Authorize {
  public async handle(
    { session }: HttpContextContract,
    next: () => Promise<void>
  ) {
    // if (session.get("userIsLoggedIn")) {
    // let lastApiCallTimeStamp = session.get("lastApiCallTimeStamp");
    // let now = DateTime.now().toMillis();
    // const thirtyMinutesInMilliseconds = 1800000;
    // if (now - lastApiCallTimeStamp > thirtyMinutesInMilliseconds) {
    const userId = session.get("user_id");
    if (userId) {
      const userSession = await Session.findByOrFail("user_id", userId);
      let now = DateTime.now();
      let lastActivityTimestamp = DateTime.fromMillis(
        Number(userSession.lastActivityTimestamp)
      );

      let thirtyMinutesAgo = now.minus({ minutes: 30 });
      if (lastActivityTimestamp < thirtyMinutesAgo) {
        // More than 30 minutes have passed since the last activity
        const message =
          "You were logged out due to inactivity. Please login again.";
        try {
         
          if (userSession) {
            await userSession.delete();
          }

          session.clear();
        } catch (error) {
          const log: genericLogData = {
            status: "failed",
            message: `Error deleting session for user timed out due to inactivity`,
          };
          appLogger("access_log", log);
        }
        const status = 601;
        throw new CustomException({
          message,
          status,
        });
      } else {
        // update the lastActivityTimestamp in the session log
        try {
          if (userId) {
            const sessionLog = await Session.findByOrFail("user_id", userId);
            await sessionLog
              .merge({ lastActivityTimestamp: BigInt(now.toMillis()) })
              .save();
            // session.put("lastApiCallTimeStamp", now);
          }
        } catch (error) {
          //TODO log the error in app logger that a session log was not found
          await next();
        }
        await next();
      }
    } else {
      await next();
    }
  }
}
