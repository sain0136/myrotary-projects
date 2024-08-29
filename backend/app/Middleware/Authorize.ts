import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CustomException from "App/Exceptions/CustomException";
import Session from "App/Models/Session";
// import CustomException from "App/Exceptions/CustomException";
import { DateTime } from "luxon";

export default class Authorize {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    const route = request.url();
    const exemptRoutes = ["/user/logout"];
    const sessionId: undefined | { value: string; lastActivity: string } =
      request.cookie("session_id");

    if (sessionId && !exemptRoutes.includes(route)) {
      await this.validateSession(sessionId.value, response);
    }

    await next();
  }

  private async validateSession(sessionId: string, response: any) {
    let userSession: Session | null = null;
    try {
      userSession = await Session.findByOrFail("session_id", sessionId);
    } catch (error) {
      handleSessionRetrievalError("Failed to retrieve session", response);
    }
    if (userSession) {
      try {
        const lastActivityTimestamp = DateTime.fromMillis(
          Number(userSession.lastActivityTimestamp)
        );
        const lastActivityTimestampThreshold = lastActivityTimestamp.plus({
          minutes: 1,
        });
        if (lastActivityTimestampThreshold < DateTime.now()) {
          await userSession.delete();
          handleSessionRetrievalError("Session expired", response);
        } else {
          await userSession
            .merge({
              lastActivityTimestamp: BigInt(DateTime.now().toMillis()),
            })
            .save();
        }
      } catch (error) {
        handleSessionRetrievalError("Failed to validate session", response);
      }
    } else {
      handleSessionRetrievalError("Session not found in database", response);
    }
  }
}

function handleSessionRetrievalError(msg: string, response: any) {
  response.clearCookie("session_id");
  throw new CustomException({
    message: msg || "Session not found in database",
    status: 601,
  });
}
