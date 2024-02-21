import Assets from "App/Models/Assets";

export default class AssetsRepositories {
  public async index() {
    return await Assets.findOrFail(1);
  }

  public async updateAssets(updateAssets: object) {
    let assetsRecord = await Assets.findOrFail(1);
    await assetsRecord
      .merge({
        assets: JSON.stringify((updateAssets as Assets).assets),
      })
      .save();
    const updatedAssets = await Assets.findOrFail(1);
    return updatedAssets;
  }
}
