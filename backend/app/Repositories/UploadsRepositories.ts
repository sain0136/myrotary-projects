import Drive from "@ioc:Adonis/Core/Drive";

export default class UploadsController {
  public async test(file: any) {
    await file.moveToDisk("./");
    let path = file.filePath;
    if (path) {
      path = await Drive.getUrl(path as string);
    }
    return path;
  }
}
