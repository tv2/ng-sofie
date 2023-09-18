import { EventConsumer, EventObserver, TypedEvent, EventSubscription } from '../abstractions/event-observer.service'
import { RobustWebSocket } from './robust-websocket.service'
import { Injectable } from '@angular/core'
import { RobustWebSocketFactory } from '../factories/robust-websocket.factory'

@Injectable()
export class WebSocketEventObserver implements EventObserver {
    private readonly subscriptions: Record<string, Set<EventConsumer>> = {}
    private readonly socket: RobustWebSocket

    constructor(private readonly robustWebSocketFactory: RobustWebSocketFactory) {
        this.socket = this.getSocket()
    }

    private getSocket(): RobustWebSocket {
        const socket = this.robustWebSocketFactory.createRobustWebSocket()
        socket.onMessage(this.parseAndPublishEvent.bind(this))
        socket.onOpen(this.publishOpenEvent.bind(this))
        socket.onClose(this.publishCloseEvent.bind(this))
        return socket
    }

    private parseAndPublishEvent(message: MessageEvent): void {
        try {
            const event: TypedEvent = this.parseEvent(message.data)
            console.log('[debug]', '[WebSocketEventObserver] Received an event:', message)
            this.publishEvent(event)
        } catch (error) {
            console.error('[error]', 'Failed to parse event.', error)
        }
    }

    private parseEvent(eventText: string): TypedEvent {
        const event: unknown = JSON.parse(eventText)
        if (!this.isValidEvent(event)) {
            throw new Error('Encountered a non-valid event')
        }
        return event
    }

    private isValidEvent(maybeEvent: unknown): maybeEvent is TypedEvent {
        const isObject = typeof maybeEvent === 'object' && maybeEvent !== null
        return isObject && 'type' in maybeEvent && 'timestamp' in maybeEvent
    }

    private publishEvent(event: TypedEvent): void {
        const consumers: EventConsumer[] = this.getConsumersOfSubject(event.type)
        consumers.map(consumer => consumer(event))
    }

    private getConsumersOfSubject(subject: string): EventConsumer[] {
        this.ensureSubject(subject)
        return Array.from(this.subscriptions[subject].values())
    }

    private publishOpenEvent(): void {
        const event: TypedEvent = { type: 'CONNECTION_OPENED', timestamp: Date.now() }
        this.publishEvent(event)
    }

    private publishCloseEvent(): void {
        const event: TypedEvent = { type: 'CONNECTION_CLOSED', timestamp: Date.now() }
        this.publishEvent(event)
    }

    public subscribe(subject: string, consumer: EventConsumer): EventSubscription {
        this.ensureSubject(subject)
        this.subscriptions[subject].add(consumer)
        return { unsubscribe: () => this.unsubscribe(subject, consumer) }
    }

    private ensureSubject(subject: string): void {
        if (subject in this.subscriptions) {
            return
        }
        this.subscriptions[subject] = new Set()
    }

    private unsubscribe(subject: string, consumer: EventConsumer): void {
        this.ensureSubject(subject)
        this.subscriptions[subject].delete(consumer)
        this.clearSubjectIfEmpty(subject)
    }

    private clearSubjectIfEmpty(subject: string): void {
        this.ensureSubject(subject)
        if (this.subscriptions[subject].size === 0) {
            delete this.subscriptions[subject]
        }
    }
}
