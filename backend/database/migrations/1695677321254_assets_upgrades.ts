import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class AddColumnsToAssets extends BaseSchema {
  protected tableName = "assets";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.json("main_logo").nullable();
      table.json("admin_content_control").nullable();
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("main_logo");
      table.dropColumn("admin_content_control");
    });
  }
}
