import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "sessions";

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.jsonb("details").nullable();
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn("details");
    });
  }
}
