import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DateTime } from "luxon";
import CustomException from "App/Exceptions/CustomException";
import { CustomErrorType } from "App/Utils/CommonTypes";

export default class Authorize {
  public async handle(
    { request, session }: HttpContextContract,
    next: () => Promise<void>
  ) {
    //TODO: Clean up
    console.info("Session Data: %j", session.all());
    console.info("Is session fresh? %s", session.fresh);
    if (
      request.parsedUrl.pathname === "/user/authenticate/" ||
      request.parsedUrl.pathname === "/user/authenticate" ||
      request.parsedUrl.pathname === "/user/logout/" ||
      request.parsedUrl.pathname === "/user/logout"
    ) {
      return next();
    }
    if (session.get("userIsLoggedIn")) {
      let lastApiCallTimeStamp = session.get("lastApiCallTimeStamp");
      let now = DateTime.now().toMillis();
      const oneHourInMilliseconds = 3600000;
      if (now - lastApiCallTimeStamp > oneHourInMilliseconds) {
        session.clear();
        const message =
          "You were logged out due to inactivity. Please login again.";
        const status = 601;
        throw new CustomException({
          message,
          status,
        });
      } else {
        session.put("lastApiCallTimeStamp", now);
        await next();
      }
    } else {
      const message = "Unauthorized access. ";
      const status = 401;
      throw new CustomException({
        message,
        status,
      } as CustomErrorType);
    }
  }
}
