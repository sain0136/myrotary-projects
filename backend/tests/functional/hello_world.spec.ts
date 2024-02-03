/**
 * This file contains a test for the welcome page of our application.
 * We are using the Japa testing framework (https://japa.dev/docs/introduction).
 *
 * The test sends a GET request to the root URL ('/') and checks two things:
 * 1. The HTTP status code of the response is 200, indicating a successful request.
 * 2. The body of the response contains the object { hello: 'world' }.
 *
 * Test api with functional tests
 * This is a basic example of a functional test where we are testing the application's response to a specific request.
 */

import { test } from '@japa/runner'

test('display welcome page', async ({ client }) => {
  const response = await client.get('/')

  response.assertStatus(200)
  response.assertBodyContains({ hello: 'world' })
})

