import { EventConsumer, EventObserver, TypedEvent, Unsubscribe } from '../interfaces/event-observer.interface'
import { Injectable } from '@angular/core'

enum ConnectionEventType {
    OPENED = 'CONNECTION_OPENED',
    CLOSED = 'CONNECTION_CLOSED',
}

@Injectable()
export class ConnectionStatusObserver {
    constructor(private readonly eventObserver: EventObserver) {}

    public subscribeToConnectionStatus(consumer: (isConnected: boolean) => void): Unsubscribe {
        const unsubscribeConnectionOpened = this.eventObserver.subscribe(ConnectionEventType.OPENED, this.createConnectionStatusConsumer(consumer))
        const unsubscribeConnectionClosed = this.eventObserver.subscribe(ConnectionEventType.CLOSED, this.createConnectionStatusConsumer(consumer))
        return () => {
            unsubscribeConnectionOpened()
            unsubscribeConnectionClosed()
        }
    }

    private createConnectionStatusConsumer(consumer: (isConnected: boolean) => void): EventConsumer {
        return (event: TypedEvent) => {
            const isConnected = event.type === ConnectionEventType.OPENED
            consumer(isConnected)
        }
    }
}
