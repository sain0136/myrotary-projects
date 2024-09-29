import Database from "@ioc:Adonis/Lucid/Database";
import Clubs from "App/Models/Clubs";
import Districts from "App/Models/Districts";
import Pledges from "App/Models/Pledges";
import Projects from "App/Models/Projects";
import Users from "App/Models/Users";
import { IProjectDetails } from "App/Shared/Interfaces/ProjectInterface";
import { IUser } from "App/Shared/Interfaces/IUser";
import { ProjectFilters } from "App/Utils/CommonTypes";
import {
  IClubProject,
  IDmProject,
  IDsgProject,
  IGenericProject,
} from "App/Shared/Interfaces/IProjects";
import { DateTime } from "luxon";
import ProjectCodeGenerator from "App/Utils/Classes/ProjectCodeGenerator";
import RotaryYear from "App/Utils/Classes/RotaryYear";
import Dinero from "dinero.js";
import { ProjectStatus } from "App/Shared/Types/commonTypes";
import CustomException from "App/Exceptions/CustomException";
import { errorTranslations } from "App/Translations/Translations";

function processProjectData(updatedProject: IClubProject | IDsgProject) {
  const convertedStartDate = DateTime.fromFormat(
    updatedProject.start_date,
    "yyyy-MM-dd"
  );
  const convertedCompletionDate = DateTime.fromFormat(
    updatedProject.completion_date,
    "yyyy-MM-dd"
  );

  updatedProject.project_name = updatedProject.project_name.trim();

  const anticipated = Dinero({ amount: updatedProject.anticipated_funding });
  const fundingGoal = Dinero({ amount: updatedProject.funding_goal });

  const nonPledgeFullyFunded = anticipated.equalsTo(fundingGoal);

  return {
    convertedStartDate,
    convertedCompletionDate,
    nonPledgeFullyFunded,
  };
}

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
    return await Pledges.query()
      .select("*")
      .where({ project_id: id })
      .orderBy("created_at", "desc");
    // }
    //   return await Database.query()
    //     .from("pledges")
    //     .select("*")
    //     .where({ project_id: id });
    //
  }

  public async index() {
    const allProjects = await Projects.all();
    return allProjects;
  }

  public async getAllProjects(currentPage: number, limit: number) {
    const allProjects = await Projects.query()
      .select("*")
      .orderBy("project_id", "desc")
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

  public async show(id: number) {
    const project = await Projects.findOrFail(id);
    return project;
  }

  public async fetchAdminAssociated(
    value: number | string | boolean,
    limit: number,
    currentPage: number
  ) {
    const projectRolesRepositories = await Database.from("project_roles")
      .where({ user_id: value })
      .orderBy("project_id", "desc")
      .paginate(currentPage, limit);
    const allProjectsAssociated = {
      data: [] as IGenericProject[],
      meta: {
        current_page: projectRolesRepositories.currentPage,
        first_page: projectRolesRepositories.firstPage,
        total: projectRolesRepositories.total,
        per_page: projectRolesRepositories.perPage,
        last_page: projectRolesRepositories.lastPage,
      },
    };
    // TODO : Refactor Hackish
    for await (const project of projectRolesRepositories) {
      const associatedProject = await Projects.query()
        .select()
        .where({ project_id: (project as IGenericProject).project_id })
        .first();
      if (associatedProject) {
        allProjectsAssociated.data.push(
          associatedProject as unknown as IGenericProject
        );
      }
    }
    return allProjectsAssociated;
  }

  public async fetchConditionalProjects(
    value: number | string | boolean,
    limit: number,
    currentPage: number,
    conditional: number | string,
    andVal?: number | string | boolean,
    andConditional1?: number | string
  ) {
    if (andConditional1) {
      return await Projects.query()
        .select()
        .where({ [conditional]: value })
        .andWhere({ [andConditional1]: andVal })
        .orderBy("project_id", "desc")
        .paginate(currentPage, limit);
    } else {
      return await Projects.query()
        .select()
        .where({ [conditional]: value })
        .orderBy("project_id", "desc")
        .paginate(currentPage, limit);
    }
  }

  public async createClubProject(newProject: IClubProject): Promise<Projects> {
    const {
      convertedStartDate,
      convertedCompletionDate,
      nonPledgeFullyFunded,
    } = processProjectData(newProject);
    const projectNumber = await ProjectCodeGenerator.getProjectCode(
      "clubInitial"
    );
    const createdProject = await Projects.create({
      projectName: newProject.project_name,
      projectDescription: newProject.project_description,
      grantType: newProject.grant_type,
      areaFocus: JSON.stringify(newProject.area_focus),
      completionDate: convertedCompletionDate,
      fundingGoal: newProject.funding_goal,
      anticipatedFunding: newProject.anticipated_funding,
      startDate: convertedStartDate,
      createdBy: newProject.created_by,
      region: newProject.region,
      rotaryYear: RotaryYear.getCurrentYear(),
      clubId: newProject.club_id,
      country: newProject.country,
      districtId: newProject.district_id,
      projectStatus: nonPledgeFullyFunded
        ? ProjectStatus.FULLYFUNDED
        : ProjectStatus.LOOKINGFORFUNDING,
      imageLink: JSON.stringify(newProject.image_link),
      totalPledges: newProject.total_pledges,
      projectNumber: projectNumber,
      projectCode: "CP-" + projectNumber.toString(),
      extraDescriptions: JSON.stringify(newProject.extra_descriptions),
      fileUploads: JSON.stringify(newProject.file_uploads),
    });
    if (createdProject.projectId) {
      await ProjectCodeGenerator.setProjectCode(
        "clubInitial",
        createdProject.projectNumber
      );
    }
    return createdProject;
  }

  public async updateClubProject(
    updatedProject: IClubProject
  ): Promise<Projects> {
    const projectToBeUpdated = await Projects.findOrFail(
      updatedProject.project_id
    );
    const {
      convertedStartDate,
      convertedCompletionDate,
      nonPledgeFullyFunded,
    } = processProjectData(updatedProject);
    const databaseUpdatedProject = await projectToBeUpdated
      .merge({
        projectName: updatedProject.project_name,
        projectDescription: updatedProject.project_description,
        grantType: updatedProject.grant_type,
        areaFocus: JSON.stringify(updatedProject.area_focus),
        completionDate: convertedCompletionDate,
        fundingGoal: updatedProject.funding_goal,
        anticipatedFunding: updatedProject.anticipated_funding,
        startDate: convertedStartDate,
        region: updatedProject.region,
        rotaryYear: updatedProject.rotary_year,
        country: updatedProject.country,
        projectStatus: nonPledgeFullyFunded
          ? ProjectStatus.FULLYFUNDED
          : ProjectStatus.LOOKINGFORFUNDING,
        imageLink: JSON.stringify(updatedProject.image_link),
        totalPledges: updatedProject.total_pledges,
        extraDescriptions: JSON.stringify(updatedProject.extra_descriptions),
        fileUploads: JSON.stringify(updatedProject.file_uploads),
      })
      .save();
    return databaseUpdatedProject;
  }

  public async createSimplifiedProject(
    newProject: IDsgProject
  ): Promise<Projects> {
    const {
      convertedStartDate,
      convertedCompletionDate,
      nonPledgeFullyFunded,
    } = processProjectData(newProject);
    const projectNumber = await ProjectCodeGenerator.getProjectCode(
      "dsgInitial"
    );
    const createdProject = await Projects.create({
      projectName: newProject.project_name,
      projectDescription: newProject.project_description,
      grantType: newProject.grant_type,
      areaFocus: JSON.stringify(newProject.area_focus),
      completionDate: convertedCompletionDate,
      startDate: convertedStartDate,
      fundingGoal: newProject.funding_goal,
      anticipatedFunding: newProject.anticipated_funding,
      createdBy: newProject.created_by,
      region: newProject.region,
      rotaryYear: RotaryYear.getCurrentYear(),
      clubId: newProject.club_id,
      country: newProject.country,
      districtId: newProject.district_id,
      projectStatus: nonPledgeFullyFunded
        ? ProjectStatus.FULLYFUNDED
        : ProjectStatus.LOOKINGFORFUNDING,
      imageLink: JSON.stringify(newProject.image_link),
      totalPledges: newProject.total_pledges,
      projectNumber: projectNumber,
      projectCode: "DS-" + projectNumber.toString(),
      coOperatingOrganisationContribution: (newProject as IDsgProject)
        .co_operating_organisation_contribution,
      districtSimplifiedGrantRequest: (newProject as IDsgProject)
        .district_simplified_grant_request,
      intialSponsorClubContribution: (newProject as IDsgProject)
        .intial_sponsor_club_contribution,
      extraDescriptions: JSON.stringify(newProject.extra_descriptions),
      itemizedBudget: JSON.stringify(
        (newProject as IDsgProject).itemized_budget
      ),
      fileUploads: JSON.stringify(newProject.file_uploads),
    });
    if (createdProject.projectId) {
      await ProjectCodeGenerator.setProjectCode(
        "dsgInitial",
        createdProject.projectNumber
      );
    }
    return createdProject;
  }
  public async updateSimplifiedProject(
    updatedProject: IDsgProject
  ): Promise<Projects> {
    const projectToBeUpdated = await Projects.findOrFail(
      updatedProject.project_id
    );
    const {
      convertedStartDate,
      convertedCompletionDate,
      nonPledgeFullyFunded,
    } = processProjectData(updatedProject);
    const databaseUpdatedProject = await projectToBeUpdated
      .merge({
        projectName: updatedProject.project_name,
        projectDescription: updatedProject.project_description,
        grantType: updatedProject.grant_type,
        areaFocus: JSON.stringify(updatedProject.area_focus),
        completionDate: convertedCompletionDate,
        startDate: convertedStartDate,
        fundingGoal: updatedProject.funding_goal,
        anticipatedFunding: updatedProject.anticipated_funding,
        region: updatedProject.region,
        rotaryYear: updatedProject.rotary_year,

        country: updatedProject.country,

        projectStatus: nonPledgeFullyFunded
          ? ProjectStatus.FULLYFUNDED
          : ProjectStatus.LOOKINGFORFUNDING,
        imageLink: JSON.stringify(updatedProject.image_link),
        totalPledges: updatedProject.total_pledges,

        coOperatingOrganisationContribution: (updatedProject as IDsgProject)
          .co_operating_organisation_contribution,
        districtSimplifiedGrantRequest: (updatedProject as IDsgProject)
          .district_simplified_grant_request,
        intialSponsorClubContribution: (updatedProject as IDsgProject)
          .intial_sponsor_club_contribution,
        extraDescriptions: JSON.stringify(updatedProject.extra_descriptions),
        itemizedBudget: JSON.stringify(
          (updatedProject as IDsgProject).itemized_budget
        ),
        fileUploads: JSON.stringify(
          (updatedProject as IDsgProject).file_uploads
        ),
      })
      .save();
    return databaseUpdatedProject;
  }

  public async createMatchingProject(
    newProject: IDmProject
  ): Promise<Projects> {
    const {
      convertedStartDate,
      convertedCompletionDate,
      nonPledgeFullyFunded,
    } = processProjectData(newProject);
    const projectNumber = await ProjectCodeGenerator.getProjectCode(
      "dmInitial"
    );
    const createdProject = await Projects.create({
      projectName: newProject.project_name,
      projectDescription: newProject.project_description,
      grantType: newProject.grant_type,
      areaFocus: JSON.stringify(newProject.area_focus),
      completionDate: convertedCompletionDate,
      startDate: convertedStartDate,
      fundingGoal: newProject.funding_goal,
      anticipatedFunding: newProject.anticipated_funding,
      createdBy: newProject.created_by,
      region: newProject.region,
      rotaryYear: RotaryYear.getCurrentYear(),
      clubId: newProject.club_id,
      country: newProject.country,
      districtId: newProject.district_id,
      projectStatus: nonPledgeFullyFunded
        ? ProjectStatus.FULLYFUNDED
        : ProjectStatus.LOOKINGFORFUNDING,
      imageLink: JSON.stringify(newProject.image_link),
      totalPledges: newProject.total_pledges,
      projectNumber: projectNumber,
      projectCode: "DM-" + projectNumber.toString(),
      coOperatingOrganisationContribution: (newProject as IDmProject)
        .co_operating_organisation_contribution,
      districtMatchingGrantRequest: (newProject as IDmProject)
        .district_matching_grant_request,
      intialSponsorClubContribution: (newProject as IDmProject)
        .intial_sponsor_club_contribution,
      extraDescriptions: JSON.stringify(newProject.extra_descriptions),
      itemizedBudget: JSON.stringify(
        (newProject as IDmProject).itemized_budget
      ),
      fileUploads: JSON.stringify(newProject.file_uploads),
      hostclubInformation: JSON.stringify(
        (newProject as IDmProject).hostclub_information
      ),
    });
    if (createdProject.projectId) {
      await ProjectCodeGenerator.setProjectCode(
        "dmInitial",
        createdProject.projectNumber
      );
    }
    return createdProject;
  }
  public async updateMatchingProject(
    updatedProject: IDmProject
  ): Promise<Projects> {
    const projectToBeUpdated = await Projects.findOrFail(
      updatedProject.project_id
    );
    const {
      convertedStartDate,
      convertedCompletionDate,
      nonPledgeFullyFunded,
    } = processProjectData(updatedProject);
    const databaseUpdatedProject = await projectToBeUpdated
      .merge({
        projectName: updatedProject.project_name,
        projectDescription: updatedProject.project_description,
        grantType: updatedProject.grant_type,
        areaFocus: JSON.stringify(updatedProject.area_focus),
        completionDate: convertedCompletionDate,
        startDate: convertedStartDate,
        fundingGoal: updatedProject.funding_goal,
        anticipatedFunding: updatedProject.anticipated_funding,
        region: updatedProject.region,
        rotaryYear: updatedProject.rotary_year,
        country: updatedProject.country,
        projectStatus: nonPledgeFullyFunded
          ? ProjectStatus.FULLYFUNDED
          : updatedProject.project_status,
        imageLink: JSON.stringify(updatedProject.image_link),
        totalPledges: updatedProject.total_pledges,
        coOperatingOrganisationContribution: (updatedProject as IDmProject)
          .co_operating_organisation_contribution,
        districtSimplifiedGrantRequest: (updatedProject as IDmProject)
          .district_simplified_grant_request,
        intialSponsorClubContribution: (updatedProject as IDmProject)
          .intial_sponsor_club_contribution,
        extraDescriptions: JSON.stringify(
          (updatedProject as IDmProject).extra_descriptions
        ),
        itemizedBudget: JSON.stringify(
          (updatedProject as IDmProject).itemized_budget
        ),
        fileUploads: JSON.stringify(updatedProject.file_uploads),
        hostclubInformation: JSON.stringify(
          (updatedProject as IDmProject).hostclub_information
        ),
      })
      .save();
    return databaseUpdatedProject;
  }

  public async deleteProject(id: number, override?: boolean) {
    const projectToBeDeleted = await Projects.findOrFail(id);
    const pledgesAssociated = await this.pledgesAsscoiated(
      projectToBeDeleted.projectId
    );
    if (override) {
      await projectToBeDeleted.delete();
      return true;
    }
    if (pledgesAssociated.length < 1) {
      await projectToBeDeleted.delete();
      return true;
    } else {
      throw new CustomException({
        message: "Project has pledges",
        status: 401,
        translatedMessage: errorTranslations["projectHasPledges"],
      });
    }
  }

  public async addProjectAdmins(userId: number, projectId: number) {
    const projectToBeUpdated = await Projects.findOrFail(projectId);
    await projectToBeUpdated.related("projectRole").attach([userId]);
  }

  public async updateProjectStatus(projectStatus: string, projectId: number) {
    const updatedProject = await Projects.findOrFail(projectId);
    await updatedProject
      .merge({
        projectStatus: projectStatus,
      })
      .save();
  }
}
