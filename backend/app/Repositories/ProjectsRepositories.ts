import Database from "@ioc:Adonis/Lucid/Database";
import Clubs from "App/Models/Clubs";
import Districts from "App/Models/Districts";
import Pledges from "App/Models/Pledges";
import Projects from "App/Models/Projects";
import Users from "App/Models/Users";
import { IProjectDetails } from "App/Shared/Interfaces/ProjectInterface";
import { IUser } from "App/Shared/Interfaces/UserInterface";

export default class ProjectsRepositories {
  public async getProjectDetails(id: number) {
    const projectById = await Projects.findOrFail(id);
    const creator = await Users.findOrFail(projectById.createdBy);
    const projectDisrict = await Districts.findOrFail(projectById.districtId);
    const projectClub = await Clubs.findOrFail(projectById.clubId);
    let projectAdmins = await Database.from("project_roles")
      .select("*")
      .where({ project_id: id });
    const allProjectAdmins = [] as IUser[];
    for await (const admin of projectAdmins) {
      const users = await Users.findOrFail(admin.user_id);
      allProjectAdmins.push(users as unknown as IUser);
    }
    const projectDetails: IProjectDetails = {
      creatorData: {
        fullName: creator.fullName,
        email: creator.email,
        phone: creator.phone ? creator.phone : "",
        clubName: "",
      },
      districtClubData: {
        clubName: projectClub.clubName,
        district_name: projectDisrict.districtName,
      },
      projectAdmins: allProjectAdmins ? allProjectAdmins : [],
    };
    return projectDetails;
  }

  public async pledgesAsscoiated(id: number): Promise<Pledges[]> {
    return await Database.query()
      .from("pledges")
      .select("*")
      .where({ project_id: id });
  }

  public async index() {
    const allProjects = await Projects.all();
    return allProjects;
  }
}
