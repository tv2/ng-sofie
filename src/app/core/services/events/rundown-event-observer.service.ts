import { EventConsumer, EventObserver, TypedEvent, Unsubscribe } from './event-observer.service'
import { Injectable } from '@angular/core'

enum RundownEventType {
    ACTIVATED = 'ACTIVATE',
    DEACTIVATED = 'DEACTIVATE',
}

interface ActivationEvent {
    isActive: boolean
    rundownId: string
}

@Injectable()
export class RundownEventObserver {
    constructor(private readonly eventObserver: EventObserver) {}

    public subscribeToRundownActivation(consumer: (event: ActivationEvent) => void): Unsubscribe {
        const unsubscribeRundownActivate = this.eventObserver.subscribe(RundownEventType.ACTIVATED, this.createRundownActivationConsumer(consumer))
        const unsubscribeRundownDeactivate = this.eventObserver.subscribe(RundownEventType.DEACTIVATED, this.createRundownActivationConsumer(consumer))
        return () => {
            unsubscribeRundownActivate()
            unsubscribeRundownDeactivate()
        }
    }

    private createRundownActivationConsumer(consumer: (event: ActivationEvent) => void): EventConsumer {
        return (event: TypedEvent) => {
            try {
                const activationEvent = this.parseActivationEvent(event)
                consumer(activationEvent)
            } catch (error) {
                console.error('Failed to parse activation event', error, event)
            }
        }
    }

    private parseActivationEvent(event: TypedEvent): ActivationEvent {
        const isActive = event.type === RundownEventType.ACTIVATED
        if (!('rundownId' in event)) {
            throw new Error('rundownId is missing from rundown activation event.')
        }
        return {
            isActive,
            rundownId: (event as any).rundownId
        }
    }
}
