import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import User from "../../app/Models/Users";

// Format for seeder files
export default class extends BaseSeeder {
  public async run() {
    const superUser: User = await User.create({
      firstname: "john",
      lastname: "doe",
      address: "123 Main St",
      userCity: "Ottawa",
      userPostal: "K4V 2VC",
      userProvince: "Ontario",
      userCountry: "Canada",
      phone: "555-555-5555",
      email: "jdoe@imutech.ca",
      password: "123456789",
      extraDetails: JSON.stringify({ profilePicture: {} }),
      districtId: 1,
      clubId: 1,
      userType: "example",
    });
    await superUser.related("districtRole").attach({
      [1]: {
        district_role: "District Admin",
      },
    });
  }
}
