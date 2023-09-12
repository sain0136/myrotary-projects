// database/migrations/xxxx_xx_xx_xxxxxx_remove_test_column_from_users.ts

import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RemoveTestColumnFromUsers extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('test_column')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.string('test_column', 255).nullable()
    })
  }
}
