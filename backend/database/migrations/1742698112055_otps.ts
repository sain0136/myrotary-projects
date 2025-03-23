import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "otps";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").unsigned().primary();
      table.string("otp_uuid", 50).notNullable().unique();
      table.string("expiry_date").notNullable(); // store as luxon date iso string
      table.timestamp("created_at");
      table.timestamp("updated_at");
      table
        .integer("user_id", 50)
        .unsigned()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
