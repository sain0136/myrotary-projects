import Database from "@ioc:Adonis/Lucid/Database";
import Clubs from "App/Models/Clubs";
import Districts from "App/Models/Districts";
import Pledges from "App/Models/Pledges";
import Projects from "App/Models/Projects";
import Users from "App/Models/Users";
import { IProjectDetails } from "App/Shared/Interfaces/ProjectInterface";
import { IUser } from "App/Shared/Interfaces/IUser";
import { ProjectFilters } from "App/Utils/CommonTypes";

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

  public async getAllProjects(currentPage: number, limit: number) {
    const allProjects = await Projects.query()
      .select("*")
      .paginate(currentPage, limit);
    return allProjects;
  }

  public async filter(projectFilters: ProjectFilters) {
    return await Projects.query()
      .where(async (db) => {
        if (projectFilters.rotary_year) {
          db.from("projects").where({
            rotary_year: projectFilters.rotary_year,
          });
        }

        if (projectFilters.grant_type) {
          db.from("projects").where({ grant_type: projectFilters.grant_type });
        }

        if (projectFilters.district_id) {
          db.from("projects").where({
            district_id: projectFilters.district_id,
          });
        }

        if (projectFilters.club_id) {
          db.from("projects").where({ club_id: projectFilters.club_id });
        }

        if (projectFilters.project_region) {
          db.from("projects").where({ region: projectFilters.project_region });
        }

        if (projectFilters.project_status) {
          db.from("projects").where({
            project_status: projectFilters.project_status,
          });
        }

        if (projectFilters.area_focus) {
          db.from("projects").whereRaw(
            `area_focus->>'$.${projectFilters.area_focus}' = 'true'`
          );
        }
        if (projectFilters.search_text) {
          await db
            .from("projects")
            .where(
              "project_description",
              "like",
              `%${projectFilters.search_text}%`
            )
            .orWhere("project_name", "like", `%${projectFilters.search_text}%`);
        }
      })
      .orderBy("project_id", "desc")
      .paginate(projectFilters.current_page, projectFilters.limit);
  }
}
