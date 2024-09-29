import PledgesRepositories from "App/Repositories/PledgesRepositories";
import { IPledge } from "App/Shared/Interfaces/IPledge";

export default class PledgesService {
  constructor(private pledgesRepositories: PledgesRepositories) {}

  public async storePledge(pledge: IPledge) {
    const createdPledge = await this.pledgesRepositories.storePledge(pledge);
    return createdPledge;
  }

  public async deletePledge(pledgeId: number) {
    const deletedPledge = await this.pledgesRepositories.deletePledge(pledgeId);
    return deletedPledge;
  }

  public async getPledgesByProject(projectId: number) {
    const pledges = await this.pledgesRepositories.getPledgesByProject(
      projectId
    );
    return pledges;
  }
}
