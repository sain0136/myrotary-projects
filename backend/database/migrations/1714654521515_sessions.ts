import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "sessions";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string("session_id").primary().notNullable();
      table.bigInteger("login_timestamp").notNullable();
      table.bigInteger("last_activity_timestamp").notNullable();
      table.string("full_name").notNullable();
      table.string("email").notNullable();
      table
        .integer("user_id")
        .notNullable()
        .unsigned()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("district_id")
        .notNullable()
        .unsigned()
        .references("district_id")
        .inTable("districts")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("club_id")
        .notNullable()
        .unsigned()
        .references("club_id")
        .inTable("clubs")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.timestamp("created_at");
      table.timestamp("updated_at");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
