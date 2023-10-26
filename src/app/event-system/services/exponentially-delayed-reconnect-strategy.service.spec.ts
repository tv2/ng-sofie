import { ExponentiallyDelayedReconnectStrategy } from './exponentially-delayed-reconnect-strategy.service'
import { ReconnectStrategy } from '../abstractions/reconnect-strategy.service'
import { instance, mock, verify, when } from '@typestrong/ts-mockito'
import { Logger } from '../../core/abstractions/logger.service'
import { TestLoggerFactory } from '../../test/factories/test-logger.factory'

describe(ExponentiallyDelayedReconnectStrategy.name, () => {
  beforeEach(() => jasmine.clock().install())

  afterEach(() => jasmine.clock().uninstall())

  describe('first retry attempt', () => {
    it('does not fire after 0ms', () => {
      const testee: ReconnectStrategy = createTestee()
      let connectTries = 0
      const connect = (): number => connectTries++

      testee.disconnected(connect)

      expect(connectTries).toBe(0)
    })

    it('does not fire after 999ms', () => {
      const testee: ReconnectStrategy = createTestee()
      let connectTries = 0
      const connect = (): number => connectTries++

      testee.disconnected(connect)
      jasmine.clock().tick(999)

      expect(connectTries).toBe(0)
    })

    it('does fire after 1000ms', () => {
      const testee: ReconnectStrategy = createTestee()
      let connectTries = 0
      const connect = (): number => connectTries++

      testee.disconnected(connect)
      jasmine.clock().tick(1000)

      expect(connectTries).toBe(1)
    })

    it('does fire after 1023ms', () => {
      const testee: ReconnectStrategy = createTestee()
      let connectTries = 0
      const connect = (): number => connectTries++

      testee.disconnected(connect)
      jasmine.clock().tick(1023)

      expect(connectTries).toBe(1)
    })
  })

  describe('second retry attempt', () => {
    it('does not fire after 0ms', () => {
      const testee: ReconnectStrategy = createTestee()
      let connectTries = 0
      const connect = (): number => connectTries++
      testee.disconnected(connect)
      jasmine.clock().tick(1000)

      testee.disconnected(connect)

      expect(connectTries).toBe(1)
    })

    it('does not fire after 3999ms', () => {
      const testee: ReconnectStrategy = createTestee()
      let connectTries = 0
      const connect = (): number => connectTries++
      testee.disconnected(connect)
      jasmine.clock().tick(1000)

      testee.disconnected(connect)
      jasmine.clock().tick(3999)

      expect(connectTries).toBe(1)
    })

    it('does fire after 4000ms', () => {
      const testee: ReconnectStrategy = createTestee()
      let connectTries = 0
      const connect = (): number => connectTries++
      testee.disconnected(connect)
      jasmine.clock().tick(1000)

      testee.disconnected(connect)
      jasmine.clock().tick(4000)

      expect(connectTries).toBe(2)
    })
  })

  describe('first retry attempt after connected', () => {
    it('does not fire after 0ms', () => {
      const testee: ReconnectStrategy = createTestee()
      let connectTries = 0
      const connect = (): number => connectTries++

      testee.disconnected(connect)
      jasmine.clock().tick(2000)
      testee.connected()

      testee.disconnected(connect)

      expect(connectTries).toBe(1)
    })

    it('does not fire after 999ms', () => {
      const testee: ReconnectStrategy = createTestee()
      let connectTries = 0
      const connect = (): number => connectTries++

      testee.disconnected(connect)
      jasmine.clock().tick(2000)
      testee.connected()

      testee.disconnected(connect)
      jasmine.clock().tick(999)

      expect(connectTries).toBe(1)
    })

    it('does fire after 1000ms', () => {
      const testee: ReconnectStrategy = createTestee()
      let connectTries = 0
      const connect = (): number => connectTries++

      testee.disconnected(connect)
      jasmine.clock().tick(2000)
      testee.connected()

      testee.disconnected(connect)
      jasmine.clock().tick(1000)

      expect(connectTries).toBe(2)
    })
  })

  describe('overlapping reconnect attempts', () => {
    it('only triggers first attempt', () => {
      const testee: ReconnectStrategy = createTestee()
      const mockedFirstConnectObject = createObservableConnectObject()
      const mockedSecondConnectObject = createObservableConnectObject()

      testee.disconnected(instance(mockedFirstConnectObject).connect)
      jasmine.clock().tick(500)
      testee.disconnected(instance(mockedSecondConnectObject).connect)
      jasmine.clock().tick(4000)

      verify(mockedFirstConnectObject.connect()).once()
      verify(mockedSecondConnectObject.connect()).never()
    })
  })
})

function createTestee(): ExponentiallyDelayedReconnectStrategy {
  return new ExponentiallyDelayedReconnectStrategy(createLogger())
}

function createObservableConnectObject(): { connect: () => void } {
  const observableFunctionObject = mock<{ connect: () => void }>()
  when(observableFunctionObject.connect()).thenReturn(undefined)
  return observableFunctionObject
}

function createLogger(): Logger {
  const testLoggerFactory: TestLoggerFactory = new TestLoggerFactory()
  return testLoggerFactory.createLogger()
}
