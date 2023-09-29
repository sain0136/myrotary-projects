import AssetsRepositories from "App/Repositories/AssetsRepositories";

export default class AssetsService {
  constructor(private assetsRepositories: AssetsRepositories) {}

  public async index() {
    return await this.assetsRepositories.index();
  }

  public async updateAssets(updateAssets: object) {
    return await this.assetsRepositories.updateAssets(updateAssets);
  }
}
