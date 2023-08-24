import { ReconnectStrategy } from './reconnect-strategy.service'

export class ExponentiallyDelayedReconnectStrategy implements ReconnectStrategy {
    private connectAttempts: number = 0

    public disconnected(): void {
        this.connectAttempts++
    }

    public connected(): void {
        this.connectAttempts = 0
    }

    public reconnect(connect: () => void): number {
        const reconnectDelay = this.getReconnectDelay()
        setTimeout(connect, reconnectDelay)
        return reconnectDelay
    }

    private getReconnectDelay(): number {
        return 1000 * Math.pow(this.connectAttempts, 2)
    }

}
