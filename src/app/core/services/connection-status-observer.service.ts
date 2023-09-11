import { EventObserver, Unsubscribe } from '../../event-system/abstractions/event-observer.service'
import { Injectable, OnDestroy } from '@angular/core'

enum ConnectionEventType {
    OPENED = 'CONNECTION_OPENED',
    CLOSED = 'CONNECTION_CLOSED',
}

@Injectable()
export class ConnectionStatusObserver implements OnDestroy {
    private readonly unsubscribeFromClosedEvent: Unsubscribe
    private hasHadOpenConnection: boolean = false

    constructor(private readonly eventObserver: EventObserver) {
        this.unsubscribeFromClosedEvent = eventObserver.subscribe(ConnectionEventType.CLOSED, () => this.hasHadOpenConnection = true)
    }

    public subscribeToReconnect(consumer: () => void): Unsubscribe {
        return this.eventObserver.subscribe(ConnectionEventType.OPENED, () => {
            if (!this.hasHadOpenConnection) {
                this.hasHadOpenConnection = true
                return
            }
            consumer()
        })
    }

    public ngOnDestroy() {
        this.unsubscribeFromClosedEvent()
    }
}
