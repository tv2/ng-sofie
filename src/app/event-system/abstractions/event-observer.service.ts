export interface TypedEvent {
    type: string
}
export type EventConsumer = (event: TypedEvent) => void
export type Unsubscribe = () => void

export abstract class EventObserver {
    public abstract subscribe(subject: string, consumer: EventConsumer): Unsubscribe
}



