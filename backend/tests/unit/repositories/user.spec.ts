import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import Users from  'App/Models/Users'

test.group('User model test', (group) => {
  group.setup(async () => {
    await Database.beginGlobalTransaction()
  })

  group.teardown(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('ensure user creation sets createdAt', async ({ assert }) => {
    const user = new Users()
    user.firstname = 'John'
    user.lastname = 'Doe'
    user.email = 'johndoe@example.com'
    await user.save()

    assert.exists(user.createdAt, 'createdAt should be set')
  })
})
