import { ReconnectStrategy } from './reconnect-strategy.service'

export class ExponentiallyDelayedReconnectStrategy implements ReconnectStrategy {
    private connectAttempts: number = 0

    public connected(): void {
        this.connectAttempts = 0
    }

    public disconnected(connect: () => void): void {
        this.connectAttempts++
        this.reconnect(connect)
    }

    private reconnect(connect: () => void): void {
        const reconnectDelay = this.getReconnectDelay()
        console.log('[info]',`Attempting to reconnect in ${reconnectDelay}ms.`)
        setTimeout(connect, reconnectDelay)
    }

    private getReconnectDelay(): number {
        return 1000 * Math.pow(this.connectAttempts, 2)
    }

}
