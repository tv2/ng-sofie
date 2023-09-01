import { ConnectionStatusObserver } from './connection-status-observer.service'
import { EventObserver } from './event-observer.service'
import { anyString, anything, instance, mock, verify, when } from '@typestrong/ts-mockito'

enum ConnectionStatusEventType {
    OPENED = 'CONNECTION_OPENED',
    CLOSED = 'CONNECTION_CLOSED',
}

describe(ConnectionStatusObserver.name, () => {
    describe(ConnectionStatusObserver.prototype.subscribeToConnectionStatus.name, () => {
        it('subscribes to connection opened events', () => {
            const mockedEventObserver = mock<EventObserver>()
            const subject = ConnectionStatusEventType.OPENED
            const testee = new ConnectionStatusObserver(instance(mockedEventObserver))

            testee.subscribeToConnectionStatus(() => { return })

            verify(mockedEventObserver.subscribe(subject, anything())).once()
        })

        it('subscribes to connection closed events', () => {
            const mockedEventObserver = mock<EventObserver>()
            const subject = ConnectionStatusEventType.CLOSED
            const testee = new ConnectionStatusObserver(instance(mockedEventObserver))

            testee.subscribeToConnectionStatus(() => { return })

            verify(mockedEventObserver.subscribe(subject, anything())).once()
        })

        it('calls the return value and unsubscribes from connection opened events', () => {
            const mockedEventObserver = mock<EventObserver>()
            const subject = ConnectionStatusEventType.OPENED
            const mockedUnsubscribe = configureUnsubscribeMock(subject, mockedEventObserver)
            const testee = new ConnectionStatusObserver(instance(mockedEventObserver))

            const unsubscribe = testee.subscribeToConnectionStatus(() => { return })
            unsubscribe()

            verify(mockedUnsubscribe()).once()
        })

        it('calls the return value and unsubscribes from connection closed events', () => {
            const mockedEventObserver = mock<EventObserver>()
            const subject = ConnectionStatusEventType.CLOSED
            const mockedUnsubscribe = configureUnsubscribeMock(subject, mockedEventObserver)
            const testee = new ConnectionStatusObserver(instance(mockedEventObserver))

            const unsubscribe = testee.subscribeToConnectionStatus(() => { return })
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
