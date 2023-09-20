export interface TypedEvent {
    type: string
    timestamp: number
}

export type EventConsumer = (event: TypedEvent) => void
export interface EventSubscription {
    unsubscribe: () => void
}

export abstract class EventObserver {
    public abstract subscribe(subject: string, consumer: EventConsumer): EventSubscription
}
