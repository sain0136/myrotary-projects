// logManager.spec.ts
import test from '@japa/runner' // Import Japa for testing
import sinon from '@' // Import Sinon for creating mocks and stubs
import { LogManager, LogTools } from 'App/Utils/LogManager' // Import the LogManager and LogTools from your application
import fs from 'fs/promises' // Import the promises version of fs for file operations
import Mail from '@ioc:Adonis/Addons/Mail' // Import the Mail addon from AdonisJS
import { Logger } from 'pino' // Import Logger from Pino

// Mock data for testing
const mockError = { message: 'Test error' }
const mockUser = { fullName: 'John Doe', email: 'john@example.com' }

test.group('LogManager', (group) => {
  // Define variables for logger, appendFile stub, and mailSend stub
  let logger: LogManager
  let appendFileStub: sinon.SinonStub
  let mailSendStub: sinon.SinonStub

  // Before each test, create a new instance of LogManager and set up stubs
  group.beforeEach(() => {
    logger = new LogManager()
    appendFileStub = sinon.stub(fs, 'appendFile').resolves() // Stub fs.appendFile to avoid actual file operations
    mailSendStub = sinon.stub(Mail, 'sendLater').resolves() // Stub Mail.sendLater to avoid sending real emails
  })

  // After each test, restore the original functions
  group.afterEach(() => {
    sinon.restore()
  })

  // Test case for logging an exception error
  test('should log an exception error', async (assert) => {
    const logSpy = sinon.spy(logger['logger'], 'error') // Spy on the logger's error method
    await logger.log(LogTools.LogTypes.EXCEPTION_ERROR, { error: mockError }) // Call the log method with EXCEPTION_ERROR type
    assert.isTrue(logSpy.calledOnce) // Assert that the error method was called once
    const logData = logSpy.getCall(0).args[0].rotaryLog // Get the logged data
    assert.equal(logData.type, 'exception_error') // Assert that the log type is correct
    assert.equal(logData.message, mockError.message) // Assert that the log message is correct
  })

  // Test case for logging an access log
  test('should log an access log', async (assert) => {
    const logSpy = sinon.spy(logger['logger'], 'info') // Spy on the logger's info method
    await logger.log(LogTools.LogTypes.ACCESS_LOG, {
      sourceUser: mockUser,
      event: LogTools.UserAccessEvent.LOGIN,
      outcome: 'success',
      errorMessage: null,
    }) // Call the log method with ACCESS_LOG type
    assert.isTrue(logSpy.calledOnce) // Assert that the info method was called once
    const logData = logSpy.getCall(0).args[0].rotaryLog // Get the logged data
    assert.equal(logData.type, 'access_log') // Assert that the log type is correct
    assert.equal(logData.event, 'login') // Assert that the event is correct
    assert.equal(logData.source, mockUser.fullName) // Assert that the source is correct
    assert.equal(logData.status, 'success') // Assert that the status is correct
  })

  // Test case for handling logger errors
  test('should handle logger errors', async (assert) => {
    appendFileStub.rejects(new Error('Failed to write to file')) // Simulate fs.appendFile throwing an error
    await logger.log(LogTools.LogTypes.EXCEPTION_ERROR, { error: mockError }) // Call the log method
    assert.isTrue(appendFileStub.called) // Assert that fs.appendFile was called
    assert.isTrue(mailSendStub.called) // Assert that Mail.sendLater was called
  })

  // Test case for logging a user log
  test('should log a user log', async (assert) => {
    const logSpy = sinon.spy(logger['logger'], 'info') // Spy on the logger's info method
    await logger.log(LogTools.LogTypes.USER_LOG, {
      sourceUser: mockUser,
      targetUser: mockUser,
      event: LogTools.UserEditEvent.CREATE,
      outcome: 'success',
      errorMessage: null,
    }) // Call the log method with USER_LOG type
    assert.isTrue(logSpy.calledOnce) // Assert that the info method was called once
    const logData = logSpy.getCall(0).args[0].rotaryLog // Get the logged data
    assert.equal(logData.type, 'user_log') // Assert that the log type is correct
    assert.equal(logData.event, 'create') // Assert that the event is correct
    assert.equal(logData.source, mockUser.fullName) // Assert that the source is correct
    assert.equal(logData.target, mockUser.fullName) // Assert that the target is correct
    assert.equal(logData.status, 'success') // Assert that the status is correct
  })
})
