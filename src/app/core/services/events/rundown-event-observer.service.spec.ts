import { RundownEventObserver } from './rundown-event-observer.service'
import { anyString, anything, instance, mock, verify, when } from '@typestrong/ts-mockito'
import { EventObserver } from './event-observer.interface'
import { RundownEventParser } from './rundown-event-parser.interface'
import { RundownEventType } from '../../models/rundown-event-type'

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
            const mockedUnsubscribe = configureUnsubscribeMock(subject, mockedEventObserver)
            const testee = new RundownEventObserver(instance(mockedEventObserver), instance(mockedRundownEventParser))

            const unsubscribe = testee.subscribeToRundownActivation(() => { return })
            unsubscribe()

            verify(mockedUnsubscribe()).once()
        })

        it('calls the return value and unsubscribes from rundown deactivated events', () => {
            const mockedEventObserver = mock<EventObserver>()
            const mockedRundownEventParser = createMockOfRundownEventParser()
            const subject = RundownEventType.DEACTIVATED
            const mockedUnsubscribe = configureUnsubscribeMock(subject, mockedEventObserver)
            const testee = new RundownEventObserver(instance(mockedEventObserver), instance(mockedRundownEventParser))

            const unsubscribe = testee.subscribeToRundownDeactivation(() => { return })
            unsubscribe()

            verify(mockedUnsubscribe()).once()
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
    when(mockedRundownEventParser.parseAdLibPieceInserted(anything())).thenCall(value => value)
    when(mockedRundownEventParser.parseInfinitePieceAdded(anything())).thenCall(value => value)
    return mockedRundownEventParser
}

function configureUnsubscribeMock(subject: string, mockedEventObserver: EventObserver): () => void {
    const mockedUnsubscribeObject = mock<{ unsubscribeFromSubject: () => void }>()
    when(mockedEventObserver.subscribe(anyString(), anything())).thenReturn(() => {})
    when(mockedEventObserver.subscribe(subject, anything()))
        .thenReturn(instance(mockedUnsubscribeObject).unsubscribeFromSubject)
    return mockedUnsubscribeObject.unsubscribeFromSubject
}
