import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DateTime } from "luxon";
import CustomException from "App/Exceptions/CustomException";
import Session from "App/Models/Session";

export default class Authorize {
  public async handle(
    { session, request }: HttpContextContract,
    next: () => Promise<void>
  ) {
    const isLogoutRoute = request. url().includes("/logout");
    if (isLogoutRoute) {
      // do not authorize logout route
      await next();
      return;
    }
    let sessionId: string | undefined = undefined;
    if (session.get("session_id")) {
      sessionId = session.get("session_id");
    } else {
      sessionId = request.qs().sid;
    }
    if (sessionId) {
      let userSession: Session;
      try {
        userSession = await Session.findByOrFail("session_id", sessionId);
      } catch (error) {
        //TODO log Error session not found for this user who did have SID from frontend or cookie
        const status = 601;
        throw new CustomException({
          message: "Session not found",
          status,
        });
      }
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
          // delete the session for the user in db and session cookie
          if (userSession) {
            await userSession.delete();
          }
          session.clear();
        } catch (error) {
          //TODO log Error deleting session for user timed out due to inactivity
        }
        const status = 601;
        throw new CustomException({
          message,
          status,
        });
      } else {
        // update the lastActivityTimestamp in the session log
        try {
          const userSession = await Session.findByOrFail(
            "session_id",
            sessionId
          );
          if (!userSession) {
          }
          await userSession
            .merge({ lastActivityTimestamp: BigInt(now.toMillis()) })
            .save();
            await next();
        } catch (error) {
          //TODO log the error in app logger that a session log was not found for the user
          throw new CustomException({
            message: "Session not found",
            status: 601,
          });
        }
      }
    } else {
      await next();
    }
  }
}
