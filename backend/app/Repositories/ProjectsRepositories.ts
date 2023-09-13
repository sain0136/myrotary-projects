import Database from "@ioc:Adonis/Lucid/Database";
import Clubs from "App/Models/Clubs";
import Districts from "App/Models/Districts";
import Pledges from "App/Models/Pledges";
import Projects from "App/Models/Projects";
import Users from "App/Models/Users";
import { ProjectDetails } from "Contracts/Shared/Interfaces/ProjectInterface";
import { IUser } from "Contracts/Shared/Interfaces/UserInterface";

export default class ProjectsRepositories {
  /**
   * @desc Retrieves project details based on a given id including information about the creator,
   * district and club associated with the project.
   * @param  {number} id
   */
  public async getProjectDetails(id: number) {
    const projectById: Projects = await Projects.findOrFail(id);
    const creator: Users = await Users.findOrFail(projectById.createdBy);
    const projectDisrict: Districts = await Districts.findOrFail(
      projectById.districtId
    );
    const projectClub: Clubs = await Clubs.findOrFail(projectById.clubId);
    let projectAdmins = await Database.from("project_roles")
      .select("*")
      .where({ project_id: id });
    const allProjectAdmins = [] as IUser[];
    for await (const admin of projectAdmins) {
      const user: Users = await Users.findOrFail(admin.user_id);
      allProjectAdmins.push(user as unknown as IUser);
    }

    const projectDetails: ProjectDetails = {
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
