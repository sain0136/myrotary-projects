import BaseSchema from "@ioc:Adonis/Lucid/Schema";
import Clubs from "App/Models/Clubs";

export default class extends BaseSchema {
  protected tableName = "clubs";

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string("subscription_id", 255).notNullable();
    });
    // Update existing rows to set subscription_id to "Exempt"
    this.defer(async () => {
      const clubs = await Clubs.all();
      for (const club of clubs) {
        await club.merge({ subscriptionId: "Exempt" }).save();
      }
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn("subscription_id");
    });
  }
}
