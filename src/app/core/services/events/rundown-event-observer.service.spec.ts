import { RundownEventObserver } from './rundown-event-observer.service'
import { anyString, anything, instance, mock, verify, when } from '@typestrong/ts-mockito'
import { EventObserver } from './event-observer.service'

enum RundownEventType {
    ACTIVATED = 'ACTIVATE',
    DEACTIVATED = 'DEACTIVATE',
}

describe(RundownEventObserver.name, () => {
    describe(RundownEventObserver.prototype.subscribeToRundownActivation.name, () => {
        it('subscribes to rundown activated events', () => {
            const mockedEventObserver = mock<EventObserver>()
            const subject = RundownEventType.ACTIVATED
            const testee = new RundownEventObserver(instance(mockedEventObserver))

            testee.subscribeToRundownActivation(() => { return })

            verify(mockedEventObserver.subscribe(subject, anything())).once()
        })

        it('subscribes to rundown deactivated events', () => {
            const mockedEventObserver = mock<EventObserver>()
            const subject = RundownEventType.DEACTIVATED
            const testee = new RundownEventObserver(instance(mockedEventObserver))

            testee.subscribeToRundownActivation(() => { return })

            verify(mockedEventObserver.subscribe(subject, anything())).once()
        })

        it('calls the return value and unsubscribes from rundown activated events', () => {
            const mockedEventObserver = mock<EventObserver>()
            const subject = RundownEventType.ACTIVATED
            const mockedUnsubscribe = configureUnsubscribeMock(subject, mockedEventObserver)
            const testee = new RundownEventObserver(instance(mockedEventObserver))

            const unsubscribe = testee.subscribeToRundownActivation(() => { return })
            unsubscribe()

            verify(mockedUnsubscribe()).once()
        })

        it('calls the return value and unsubscribes from rundown deactivated events', () => {
            const mockedEventObserver = mock<EventObserver>()
            const subject = RundownEventType.DEACTIVATED
            const mockedUnsubscribe = configureUnsubscribeMock(subject, mockedEventObserver)
            const testee = new RundownEventObserver(instance(mockedEventObserver))

            const unsubscribe = testee.subscribeToRundownActivation(() => { return })
            unsubscribe()

            verify(mockedUnsubscribe()).once()
        })
    })
})

function configureUnsubscribeMock(subject: string, mockedEventObserver: EventObserver): () => void {
    const mockedUnsubscribeObject = mock<{ unsubscribeFromSubject: () => void }>()
    when(mockedEventObserver.subscribe(anyString(), anything())).thenReturn(() => {})
    when(mockedEventObserver.subscribe(subject, anything()))
        .thenReturn(instance(mockedUnsubscribeObject).unsubscribeFromSubject)
    return mockedUnsubscribeObject.unsubscribeFromSubject
}
