import Database from "@ioc:Adonis/Lucid/Database";
import Pledges from "App/Models/Pledges";
import Projects from "App/Models/Projects";
import { IPledge } from "App/Shared/Interfaces/IProjects";
import { ProjectStatus } from "App/Shared/Types/commonTypes";

export default class PledgesRepositories {
  public async storePledge(pledge: IPledge) {
    await Database.transaction(async (trx) => {
      const project = await Projects.query({ client: trx })
        .where("id", pledge.project_id)
        .firstOrFail();
      const newPledge = new Pledges();
      newPledge.useTransaction(trx);
      await newPledge
        .merge({
          pledgeAmount: pledge.pledge_amount,
          firstname: pledge.firstname,
          lastname: pledge.lastname,
          email: pledge.email,
          phone: pledge.phone,
          districtNumber: pledge.district_number
            ? pledge.district_number
            : undefined,
          clubName: pledge.club_name ? pledge.club_name : undefined,
          projectId: pledge.project_id,
          userId: pledge.user_id,
        })
        .save();

      let changeStatus: Boolean = false;
      if (
        parseFloat(project.anticipatedFunding.toString()) +
          parseFloat(pledge.pledge_amount.toString()) ===
          parseFloat(project.fundingGoal.toString()) &&
        project.projectStatus === ProjectStatus.LOOKINGFORFUNDING
      ) {
        changeStatus = true;
      }

      project.useTransaction(trx);
      await project
        .merge({
          anticipatedFunding:
            parseFloat(project.anticipatedFunding.toString()) +
            pledge.pledge_amount,
          totalPledges:
            parseFloat(project.totalPledges.toString()) + pledge.pledge_amount,
          projectStatus: changeStatus
            ? ProjectStatus.FULLYFUNDED
            : ProjectStatus.LOOKINGFORFUNDING,
        })
        .save();
    });
  }
}
