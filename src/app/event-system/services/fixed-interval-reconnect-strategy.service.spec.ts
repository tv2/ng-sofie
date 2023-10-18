import { FixedIntervalReconnectStrategy } from './fixed-interval-reconnect-strategy.service'
import { Logger } from '../../core/abstractions/logger.service'
import { anyString, anything, instance, mock, when } from '@typestrong/ts-mockito'

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
  const mockedLogger: Logger = createMockOfLogger()
  return new FixedIntervalReconnectStrategy(instance(mockedLogger))
}

// TODO: Extract to one place
function createMockOfLogger(): Logger {
  const mockedLogger: Logger = mock<Logger>()
  when(mockedLogger.tag(anyString())).thenCall(() => instance(createMockOfLogger()))
  when(mockedLogger.data(anything())).thenCall(() => instance(createMockOfLogger()))
  when(mockedLogger.metadata(anything())).thenCall(() => instance(createMockOfLogger()))
  return mockedLogger
}
