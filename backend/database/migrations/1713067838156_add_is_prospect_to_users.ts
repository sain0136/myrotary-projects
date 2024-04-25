import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'add_is_prospect_to_users'

  public async up () {
    this.schema.table('users', (table) => {
      table.boolean('is_prospect').defaultTo(false)
    })
  }
  public async down () {
    this.schema.table('users', (table) => {
      table.dropColumn('test_column')
    })
  }
}
