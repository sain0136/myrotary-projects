import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
// import CustomException from "App/Exceptions/CustomException";

export default class Authorize {
  public async handle(
    { request }: HttpContextContract,
    next: () => Promise<void>
  ) {
    const exemptroutes = ["getAllDistricts", "logout", "getAllProjects", "getRotaryYears"];
    const route = request.url().split("/").pop();
    if (exemptroutes.includes(route as string)) {
      // do not authorize logout route
      await next();
      return;
    }

    // Proceed to the next middleware or controller
    await next();
  }
}