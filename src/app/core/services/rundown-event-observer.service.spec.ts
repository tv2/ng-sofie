import { RundownEventObserver } from './rundown-event-observer.service'
import { anyString, anything, instance, mock, verify, when } from '@typestrong/ts-mockito'
import { EventObserver, EventSubscription } from '../../event-system/abstractions/event-observer.service'
import { RundownEventValidator } from '../abstractions/rundown-event-validator.service'
import { RundownEventType } from '../models/rundown-event-type'
import { Logger } from '../abstractions/logger.service'
import { TestLoggerFactory } from '../../test/factories/test-logger.factory'

describe(RundownEventObserver.name, () => {
  describe(RundownEventObserver.prototype.subscribeToRundownActivation.name, () => {
    it('subscribes to rundown activated events', () => {
      const mockedEventObserver = mock<EventObserver>()
      const subject = RundownEventType.ACTIVATED
      const testee: RundownEventObserver = createTestee({ eventObserver: instance(mockedEventObserver) })

      testee.subscribeToRundownActivation(() => {
        return
      })

      verify(mockedEventObserver.subscribe(subject, anything())).once()
    })

    it('subscribes to rundown deactivated events', () => {
      const mockedEventObserver = mock<EventObserver>()
      const subject = RundownEventType.DEACTIVATED
      const testee: RundownEventObserver = createTestee({ eventObserver: instance(mockedEventObserver) })

      testee.subscribeToRundownDeactivation(() => {
        return
      })

      verify(mockedEventObserver.subscribe(subject, anything())).once()
    })

    it('calls the return value and unsubscribes from rundown activated events', () => {
      const mockedEventObserver = mock<EventObserver>()
      const subject = RundownEventType.ACTIVATED
      const mockedEventSubscription = configureEventSubscriptionMock(subject, mockedEventObserver)
      const testee: RundownEventObserver = createTestee({ eventObserver: instance(mockedEventObserver) })

      const eventSubscription = testee.subscribeToRundownActivation(() => {
        return
      })
      eventSubscription.unsubscribe()

      verify(mockedEventSubscription.unsubscribe()).once()
    })

    it('calls the return value and unsubscribes from rundown deactivated events', () => {
      const mockedEventObserver = mock<EventObserver>()
      const subject = RundownEventType.DEACTIVATED
      const mockedEventSubscription = configureEventSubscriptionMock(subject, mockedEventObserver)
      const testee: RundownEventObserver = createTestee({ eventObserver: instance(mockedEventObserver) })

      const eventSubscription = testee.subscribeToRundownDeactivation(() => {
        return
      })
      eventSubscription.unsubscribe()

      verify(mockedEventSubscription.unsubscribe()).once()
    })
  })
})

function createTestee(parameters: { eventObserver?: EventObserver; rundownEventParser?: RundownEventValidator; logger?: Logger } = {}): RundownEventObserver {
  const mockedEventObserver: EventObserver = parameters.eventObserver ?? instance(mock<EventObserver>())
  const mockedRundownEventParser: RundownEventValidator = parameters.rundownEventParser ?? instance(createMockOfRundownEventParser())
  const mockedLogger: Logger = parameters.logger ?? createLogger()
  return new RundownEventObserver(mockedEventObserver, mockedRundownEventParser, mockedLogger)
}

function createMockOfRundownEventParser(): RundownEventValidator {
  const mockedRundownEventParser = mock<RundownEventValidator>()
  when(mockedRundownEventParser.validateRundownActivatedEvent(anything())).thenCall(value => value)
  when(mockedRundownEventParser.validateRundownDeactivatedEvent(anything())).thenCall(value => value)
  when(mockedRundownEventParser.validateRundownResetEvent(anything())).thenCall(value => value)
  when(mockedRundownEventParser.validateTakenEvent(anything())).thenCall(value => value)
  when(mockedRundownEventParser.validateSetNextEvent(anything())).thenCall(value => value)
  when(mockedRundownEventParser.validateInfinitePiecesUpdatedEvent(anything())).thenCall(value => value)
  return mockedRundownEventParser
}

function configureEventSubscriptionMock(subject: string, mockedEventObserver: EventObserver): EventSubscription {
  const mockedUnsubscribeObject = mock<EventSubscription>()
  when(mockedEventObserver.subscribe(anyString(), anything())).thenReturn({ unsubscribe: () => {} })
  when(mockedEventObserver.subscribe(subject, anything())).thenReturn(instance(mockedUnsubscribeObject))
  return mockedUnsubscribeObject
}

function createLogger(): Logger {
  const testLoggerFactory: TestLoggerFactory = new TestLoggerFactory()
  return testLoggerFactory.createLogger()
}
