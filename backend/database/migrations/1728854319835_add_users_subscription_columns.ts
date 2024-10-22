import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string("subscription_id", 255).nullable();
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn("subscription_id");
    });
  }
}
