import UploadsRepositories from "App/Repositories/UploadsRepositories";

export default class UploadsService {
  constructor(private uploadsRepositories: UploadsRepositories) {}

  public async test(file: any) {
    return await this.uploadsRepositories.test(file);
  }
}
