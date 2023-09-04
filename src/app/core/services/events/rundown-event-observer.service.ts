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
        const unsubscribeRundownActivate: Unsubscribe = this.eventObserver.subscribe(RundownEventType.ACTIVATED, this.createRundownActivationConsumer(consumer))
        const unsubscribeRundownDeactivate: Unsubscribe = this.eventObserver.subscribe(RundownEventType.DEACTIVATED, this.createRundownActivationConsumer(consumer))
        return () => {
            unsubscribeRundownActivate()
            unsubscribeRundownDeactivate()
        }
    }

    private createRundownActivationConsumer(consumer: (event: ActivationEvent) => void): EventConsumer {
        return (event: TypedEvent) => {
            try {
                const activationEvent: ActivationEvent = this.parseActivationEvent(event)
                consumer(activationEvent)
            } catch (error) {
                console.error('Failed to parse activation event', error, event)
            }
        }
    }

    private parseActivationEvent(event: TypedEvent): ActivationEvent {
        if (!('rundownId' in event)) {
            throw new Error('rundownId is missing from rundown activation event.')
        }
        return {
            isActive: event.type === RundownEventType.ACTIVATED,
            // TODO: Add better schema validation (e.g. with zod).
            rundownId: (event as any).rundownId
        }
    }
}
