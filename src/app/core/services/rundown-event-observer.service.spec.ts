import { RundownEventObserver } from './rundown-event-observer.service'
import { anyString, anything, instance, mock, verify, when } from '@typestrong/ts-mockito'
import { EventObserver, EventSubscription } from '../../event-system/abstractions/event-observer.service'
import { RundownEventParser } from '../abstractions/rundown-event.parser'
import { RundownEventType } from '../models/rundown-event-type'
import { Logger } from '../abstractions/logger.service'

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

function createTestee(parameters: { eventObserver?: EventObserver; rundownEventParser?: RundownEventParser; logger?: Logger } = {}): RundownEventObserver {
  const mockedEventObserver: EventObserver = parameters.eventObserver ?? instance(mock<EventObserver>())
  const mockedRundownEventParser: RundownEventParser = parameters.rundownEventParser ?? instance(createMockOfRundownEventParser())
  const mockedLogger: Logger = parameters.logger ?? instance(createMockOfLogger())
  return new RundownEventObserver(mockedEventObserver, mockedRundownEventParser, mockedLogger)
}

function createMockOfRundownEventParser(): RundownEventParser {
  const mockedRundownEventParser = mock<RundownEventParser>()
  when(mockedRundownEventParser.parseActivatedEvent(anything())).thenCall(value => value)
  when(mockedRundownEventParser.parseDeactivatedEvent(anything())).thenCall(value => value)
  when(mockedRundownEventParser.parseResetEvent(anything())).thenCall(value => value)
  when(mockedRundownEventParser.parseTakenEvent(anything())).thenCall(value => value)
  when(mockedRundownEventParser.parseSetNextEvent(anything())).thenCall(value => value)
  when(mockedRundownEventParser.parseInfinitePieceAdded(anything())).thenCall(value => value)
  return mockedRundownEventParser
}

function configureEventSubscriptionMock(subject: string, mockedEventObserver: EventObserver): EventSubscription {
  const mockedUnsubscribeObject = mock<EventSubscription>()
  when(mockedEventObserver.subscribe(anyString(), anything())).thenReturn({ unsubscribe: () => {} })
  when(mockedEventObserver.subscribe(subject, anything())).thenReturn(instance(mockedUnsubscribeObject))
  return mockedUnsubscribeObject
}

// TODO: Extract to one place
function createMockOfLogger(): Logger {
  const mockedLogger: Logger = mock<Logger>()
  when(mockedLogger.tag(anyString())).thenCall(() => instance(createMockOfLogger()))
  when(mockedLogger.data(anything())).thenCall(() => instance(createMockOfLogger()))
  when(mockedLogger.metadata(anything())).thenCall(() => instance(createMockOfLogger()))
  return mockedLogger
}
