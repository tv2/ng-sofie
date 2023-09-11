import { ConnectionStatusObserver } from './connection-status-observer.service'
import { EventObserver } from './event-observer.interface'
import { anyFunction, anyString, anything, capture, instance, mock, verify, when } from '@typestrong/ts-mockito'

enum ConnectionStatusEventType {
    OPENED = 'CONNECTION_OPENED',
    CLOSED = 'CONNECTION_CLOSED',
}

describe(ConnectionStatusObserver.name, () => {
    describe(ConnectionStatusObserver.prototype.subscribeToReconnect.name, () => {
        it('subscribes to connection opened events', () => {
            const mockedEventObserver = mock<EventObserver>()
            const subject = ConnectionStatusEventType.OPENED
            const testee = new ConnectionStatusObserver(instance(mockedEventObserver))

            testee.subscribeToReconnect(() => { return })

            verify(mockedEventObserver.subscribe(subject, anything())).once()
        })

        it('does not trigger the consumer if the only event is open', () => {
            const mockedEventObserver = mock<EventObserver>()
            const testee = new ConnectionStatusObserver(instance(mockedEventObserver))
            let numberOfReconnects = 0
            testee.subscribeToReconnect(() => numberOfReconnects++)
            const openedConsumer = capture<string, () => void>(mockedEventObserver.subscribe).last()[1]

            openedConsumer()

            expect(numberOfReconnects).toBe(0)
        })

        it('triggers the consumer if two opened events occurrs', () => {
            const mockedEventObserver = mock<EventObserver>()
            const testee = new ConnectionStatusObserver(instance(mockedEventObserver))

            let numberOfReconnects = 0
            testee.subscribeToReconnect(() => numberOfReconnects++)
            const openedConsumer = capture<string, () => void>(mockedEventObserver.subscribe).last()[1]

            openedConsumer()
            openedConsumer()

            expect(numberOfReconnects).toBe(1)
        })

        it('triggers the consumer if a closed followed by an opened events occurs', () => {
            const mockedEventObserver = mock<EventObserver>()
            const testee = new ConnectionStatusObserver(instance(mockedEventObserver))

            let numberOfReconnects = 0
            testee.subscribeToReconnect(() => numberOfReconnects++)
            const closedConsumer = capture<string, () => void>(mockedEventObserver.subscribe).first()[1]
            const openedConsumer = capture<string, () => void>(mockedEventObserver.subscribe).last()[1]

            closedConsumer()
            openedConsumer()

            expect(numberOfReconnects).toBe(1)
        })

        it('triggers the consumer twice if a closed followed by two opened events occurs', () => {
            const mockedEventObserver = mock<EventObserver>()
            const testee = new ConnectionStatusObserver(instance(mockedEventObserver))

            let numberOfReconnects = 0
            testee.subscribeToReconnect(() => numberOfReconnects++)
            const closedConsumer = capture<string, () => void>(mockedEventObserver.subscribe).first()[1]
            const openedConsumer = capture<string, () => void>(mockedEventObserver.subscribe).last()[1]

            closedConsumer()
            openedConsumer()
            openedConsumer()

            expect(numberOfReconnects).toBe(2)
        })
    })
})
