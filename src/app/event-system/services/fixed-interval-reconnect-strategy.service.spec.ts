import { FixedIntervalReconnectStrategy } from './fixed-interval-reconnect-strategy.service'
import { Logger } from '../../core/abstractions/logger.service'
import { TestLoggerFactory } from '../../test/factories/test-logger.factory'

describe(FixedIntervalReconnectStrategy.name, () => {
  beforeEach(() => jasmine.clock().install())

  afterEach(() => jasmine.clock().uninstall())

  it('does not fire after 0ms', () => {
    const testee: FixedIntervalReconnectStrategy = createTestee()
    let connectTries = 0
    const connect = (): number => connectTries++

    testee.disconnected(connect)

    expect(connectTries).toBe(0)
  })

  it('does not fire after 1999ms', () => {
    const testee: FixedIntervalReconnectStrategy = createTestee()
    let connectTries = 0
    const connect = (): number => connectTries++

    testee.disconnected(connect)
    jasmine.clock().tick(1999)

    expect(connectTries).toBe(0)
  })

  it('does fire after 2000ms', () => {
    const testee: FixedIntervalReconnectStrategy = createTestee()
    let connectTries = 0
    const connect = (): number => connectTries++

    testee.disconnected(connect)
    jasmine.clock().tick(2000)

    expect(connectTries).toBe(1)
  })
})
function createTestee(): FixedIntervalReconnectStrategy {
  return new FixedIntervalReconnectStrategy(createLogger())
}

function createLogger(): Logger {
  const testLoggerFactory: TestLoggerFactory = new TestLoggerFactory()
  return testLoggerFactory.createLogger()
}
