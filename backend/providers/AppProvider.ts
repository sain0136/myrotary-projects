import type { ApplicationContract } from "@ioc:Adonis/Core/Application";

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
    isGuestUserPresent();
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}

async function isGuestUserPresent() {
  const { LogManager, LogTools } = await import("App/Utils/AppLogger");
  try {
    const db = await import("@ioc:Adonis/Lucid/Database");
    const guestUser = await db.default
      .from("users")
      .where("user_id", 1)
      .orWhere("user_id", 4); // Check if guest user is present in the database or not. Horrible way to check but it works.  
    const queriedGuestUser = await db.default
      .from("users")
      .where("email", "quest424234ffgfdgfdgfdg@imutech.ca");
    const User = await import("App/Models/Users");
    const District = await import("App/Models/Districts");
    const allDistricts = await District.default.all(); // Get all districts .. we should have at least one district.
    if (allDistricts.length === 0) {
      throw new Error("No district found in the database");
    }
    if (guestUser.length === 0 && queriedGuestUser.length === 0) {
      const guest = await User.default.create({
        firstname: "Johnny",
        lastname: "Guest",
        address: "123 Main St",
        userCity: "Ottawa",
        userPostal: "K4V 2VC",
        userProvince: "Ontario",
        userCountry: "Canada",
        phone: "555-555-5555",
        email: "quest424234ffgfdgfdgfdg@imutech.ca",
        password: "123456789",
        extraDetails: JSON.stringify({ profilePicture: {} }),
        districtId: allDistricts[0].districtId,
        clubId: undefined,
        userType: "example",
        userId: 1,
      });
      await guest.related("districtRole").attach({
        [1]: {
          district_role: "Guest",
        },
      });
    }
  } catch (error) {
    const appLogger = new LogManager();
    appLogger.log(LogTools.LogTypes.EXCEPTION_ERROR, {
      error,
      customMessage:
        "Error while checking for guest user, meaning guest user might not be present",
    });
  }
}
