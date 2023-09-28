import { RundownEventObserver } from './rundown-event-observer.service'
import { anyString, anything, instance, mock, verify, when } from '@typestrong/ts-mockito'
import { EventObserver, EventSubscription } from '../../event-system/abstractions/event-observer.service'
import { RundownEventParser } from '../abstractions/rundown-event.parser'
import { RundownEventType } from '../models/rundown-event-type'

describe(RundownEventObserver.name, () => {
    describe(RundownEventObserver.prototype.subscribeToRundownActivation.name, () => {
        it('subscribes to rundown activated events', () => {
            const mockedEventObserver = mock<EventObserver>()
            const mockedRundownEventParser = createMockOfRundownEventParser()
            const subject = RundownEventType.ACTIVATED
            const testee = new RundownEventObserver(instance(mockedEventObserver), instance(mockedRundownEventParser))

            testee.subscribeToRundownActivation(() => { return })

            verify(mockedEventObserver.subscribe(subject, anything())).once()
        })

        it('subscribes to rundown deactivated events', () => {
            const mockedEventObserver = mock<EventObserver>()
            const mockedRundownEventParser = createMockOfRundownEventParser()
            const subject = RundownEventType.DEACTIVATED
            const testee = new RundownEventObserver(instance(mockedEventObserver), instance(mockedRundownEventParser))

            testee.subscribeToRundownDeactivation(() => { return })

            verify(mockedEventObserver.subscribe(subject, anything())).once()
        })

        it('calls the return value and unsubscribes from rundown activated events', () => {
            const mockedEventObserver = mock<EventObserver>()
            const mockedRundownEventParser = createMockOfRundownEventParser()
            const subject = RundownEventType.ACTIVATED
            const mockedEventSubscription = configureEventSubscriptionMock(subject, mockedEventObserver)
            const testee = new RundownEventObserver(instance(mockedEventObserver), instance(mockedRundownEventParser))

            const eventSubscription = testee.subscribeToRundownActivation(() => { return })
            eventSubscription.unsubscribe()

            verify(mockedEventSubscription.unsubscribe()).once()
        })

        it('calls the return value and unsubscribes from rundown deactivated events', () => {
            const mockedEventObserver = mock<EventObserver>()
            const mockedRundownEventParser = createMockOfRundownEventParser()
            const subject = RundownEventType.DEACTIVATED
            const mockedEventSubscription = configureEventSubscriptionMock(subject, mockedEventObserver)
            const testee = new RundownEventObserver(instance(mockedEventObserver), instance(mockedRundownEventParser))

            const eventSubscription = testee.subscribeToRundownDeactivation(() => { return })
            eventSubscription.unsubscribe()

            verify(mockedEventSubscription.unsubscribe()).once()
        })
    })
})

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
    when(mockedEventObserver.subscribe(subject, anything()))
        .thenReturn(instance(mockedUnsubscribeObject))
    return mockedUnsubscribeObject
}
