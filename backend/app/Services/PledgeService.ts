import PledgesRepositories from "App/Repositories/PledgeRepositories";
import { IPledge } from "App/Shared/Interfaces/IPledge";

export default class PledgesService {
  constructor(private pledgesRepositories: PledgesRepositories) {}

  public async storePledge(pledge: IPledge) {
    const createdPledge = await this.pledgesRepositories.storePledge(pledge);
    return createdPledge;
  }
}
