import { EventConsumer, EventObserver, TypedEvent, Unsubscribe } from './event-observer.service'
import { Injectable } from '@angular/core'

enum ConnectionEvent {
    OPENED = 'CONNECTION_OPENED',
    CLOSED = 'CONNECTION_CLOSED',
}

@Injectable()
export class ConnectionStatusObserver {
    constructor(private readonly eventObserver: EventObserver) {}

    public subscribeToConnectionStatus(consumer: (isConnected: boolean) => void): Unsubscribe {
        const unsubscribeConnectionOpened = this.eventObserver.subscribe(ConnectionEvent.OPENED, this.createConnectionStatusConsumer(consumer))
        const unsubscribeConnectionClosed = this.eventObserver.subscribe(ConnectionEvent.CLOSED, this.createConnectionStatusConsumer(consumer))
        return () => {
            unsubscribeConnectionOpened()
            unsubscribeConnectionClosed()
        }
    }

    private createConnectionStatusConsumer(consumer: (isConnected: boolean) => void): EventConsumer {
        return (event: TypedEvent) => {
            const isConnected = event.type === ConnectionEvent.OPENED
            consumer(isConnected)
        }
    }
}
