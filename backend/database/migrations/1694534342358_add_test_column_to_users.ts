// database/migrations/xxxx_xx_xx_xxxxxx_add_test_column_to_users.ts

import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddTestColumnToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.string('test_column', 255).nullable()
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('test_column')
    })
  }
}
