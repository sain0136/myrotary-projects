import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DateTime } from "luxon";
import CustomException from "App/Exceptions/CustomException";

export default class Authorize {
  public async handle(
    { session }: HttpContextContract,
    next: () => Promise<void>
  ) {
    if (session.get("userIsLoggedIn")) {
      let lastApiCallTimeStamp = session.get("lastApiCallTimeStamp");
      let now = DateTime.now().toMillis();
      const oneHourInMilliseconds = 3600000;
      const twentySecondsInMilliseconds = 20000;
      if (now - lastApiCallTimeStamp > twentySecondsInMilliseconds) {
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
      await next();
    }
  }
}
