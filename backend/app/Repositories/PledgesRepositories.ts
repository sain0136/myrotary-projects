import Database from "@ioc:Adonis/Lucid/Database";
import Pledges from "App/Models/Pledges";
import Projects from "App/Models/Projects";
import Dinero from "dinero.js";
import { ProjectStatus } from "App/Shared/Types/commonTypes";
import { IPledge } from "App/Shared/Interfaces/IPledge";
import CustomException from "App/Exceptions/CustomException";

export default class PledgesRepositories {
  public async storePledge(pledge: IPledge) {
    // Initiating a database transaction to ensure data integrity
    await Database.transaction(async (trx) => {
      // Fetching the project associated with the pledge within the transaction
      const project = await Projects.query({ client: trx })
        .where("project_id", pledge.project_id)
        .firstOrFail();

      // Preparing a new pledge instance
      const newPledge = new Pledges();
      newPledge.useTransaction(trx);

      // Saving the pledge details to the database
      await newPledge
        .merge({
          pledgeAmount: pledge.pledge_amount, // Storing pledge amount in cents
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

      // Initializing Dinero instances for precise monetary arithmetic
      const anticipatedFunding = Dinero({ amount: project.anticipatedFunding }); // already in cents
      const pledgeAmount = Dinero({ amount: pledge.pledge_amount }); // already in cents
      const fundingGoal = Dinero({ amount: project.fundingGoal }); // already in cents

      // Checking if the project is fully funded after this pledge
      let changeStatus: Boolean = false;
      if (
        anticipatedFunding.add(pledgeAmount).equalsTo(fundingGoal) &&
        project.projectStatus === ProjectStatus.LOOKINGFORFUNDING
      ) {
        changeStatus = true;
      }

      // Calculating the new total pledges and anticipated funding values
      const newTotalPledges = Dinero({ amount: project.totalPledges })
        .add(pledgeAmount)
        .getAmount();
      const newAnticipatedFunding = anticipatedFunding
        .add(pledgeAmount)
        .getAmount();

      // Updating the project details in the database
      project.useTransaction(trx);
      await project
        .merge({
          anticipatedFunding: newAnticipatedFunding,
          totalPledges: newTotalPledges,
          projectStatus: changeStatus
            ? ProjectStatus.FULLYFUNDED
            : ProjectStatus.LOOKINGFORFUNDING,
        })
        .save();
    });
  }

  public async deletePledge(pledgeId: number) {
    const pledge = await Pledges.findOrFail(pledgeId);
    if (pledge.projectId) {
      const project = await Projects.findOrFail(pledge.projectId);
      if (project.projectId) {
        // Calculating the new total pledges and anticipated funding values
        const anticipatedFunding = Dinero({
          amount: project.anticipatedFunding,
        });
        const pledgeAmount = Dinero({ amount: pledge.pledgeAmount }); // already in cents
        const newTotalPledges = Dinero({ amount: project.totalPledges }) // already in cents
          .subtract(pledgeAmount)
          .getAmount();
        const newAnticipatedFunding = anticipatedFunding
          .subtract(pledgeAmount)
          .getAmount();

        // Updating the project details in the database
        await project
          .merge({
            totalPledges: newTotalPledges,
            anticipatedFunding: newAnticipatedFunding,
            projectStatus: ProjectStatus.LOOKINGFORFUNDING,
          })
          .save();
        await pledge.delete();
      } else {
        throw new CustomException({
          message: "Project not found",
          errorCode: 901000,
        });
      }
    } else {
      throw new CustomException({
        message: "Pledge not found",
        errorCode: 901000,
      });
    }
  }

  public async getPledgesByProject(projectId: number) {
    const pledges = await Pledges.query().where("project_id", projectId);
    return pledges;
  }
}
