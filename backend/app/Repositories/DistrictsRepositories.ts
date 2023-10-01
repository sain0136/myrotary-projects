import CustomException from "App/Exceptions/CustomException";
import Clubs from "App/Models/Clubs";
import Districts from "App/Models/Districts";
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
      districtName: "district " + district.district_name,
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
            en: "You can't delete a District that has Clubs",
            fr: "Vous ne pouvez pas supprimer un District qui a des Clubs",
          },
        });
      }
    }
  }
}
