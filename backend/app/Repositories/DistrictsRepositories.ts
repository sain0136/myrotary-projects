import CustomException from "App/Exceptions/CustomException";
import Clubs from "App/Models/Clubs";
import Districts from "App/Models/Districts";
import Users from "App/Models/Users";
import type { IDistrict } from "App/Shared/Interfaces/IDistrict";

export default class DistrictsRepositories {
  public async index(
    currentPage: number,
    limit: number,
    allFlag?: boolean | null
  ) {
    const allDistricts = !allFlag
      ? await Districts.query().select("*").paginate(currentPage, limit)
      : await Districts.all();
    return allDistricts;
  }

  public async createDistrict(district: IDistrict) {
    await Districts.create({
      districtNumber: "D-" + district.district_name,
      districtName: "District " + district.district_name,
      districtEmail: district.district_email,
      districtPresident: district.district_president,
      districtDescription: district.district_description,
      siteUrl: district.site_url,
      districtDetails: JSON.stringify(district.district_details),
    });
  }

  public async updateDistrict(district: IDistrict) {
    const currentDistrict = await Districts.findOrFail(district.district_id);
    await currentDistrict
      .merge({
        districtNumber: district.district_number,
        districtName: district.district_name,
        districtEmail: district.district_email,
        districtPresident: district.district_president,
        districtDescription: district.district_description,
        siteUrl: district.site_url,
        districtDetails: JSON.stringify(district.district_details),
      })
      .save();
  }

  public async getById(id: number): Promise<Districts> {
    const district: Districts = await Districts.findOrFail(id);
    return district;
  }

  public async deleteDistrict(ids: number[]) {
    for await (const id of ids) {
      const district = await Districts.findOrFail(id);
      const clubFound: Clubs[] = await district.related("clubs").query();
      if (clubFound.length <= 0) {
        await district.delete();
      } else {
        throw new CustomException({
          message: "You can't delete a District that has Clubs",
          translatedMessage: {
            en: "You can't delete Districts that have Clubs associated",
            fr: "Vous ne pouvez pas supprimer un District qui a des Clubs associés",
          },
        });
      }
    }
  }

  public async getDistrictAdmins(
    districtId: number,
    currentPage: number,
    limit: number,
    allFlag?: boolean
  ) {
    const allAdmins = !allFlag
      ? await Users.query()
          .where({ district_id: districtId })
          .paginate(currentPage, limit)
      : await Users.query()
          .where({ userType: "DISTRICT" })
          .paginate(currentPage, limit);
    for await (const user of allAdmins) {
      user.role = await user
        .related("districtRole")
        .pivotQuery()
        .where({ user_id: user.userId });
      const district = await Districts.findOrFail(user.districtId);
      user.extraDetails = { district_name: district.districtName };
    }
    return allAdmins;
  }
}
