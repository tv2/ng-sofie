import { ReconnectStrategy } from '../interfaces/reconnect-strategy.interface'

export class ExponentiallyDelayedReconnectStrategy implements ReconnectStrategy {
    private connectAttempts: number = 0
    private delayTimer?: NodeJS.Timeout

    public connected(): void {
        this.connectAttempts = 0
    }

    public disconnected(connect: () => void): void {
        if (this.delayTimer) {
            return
        }
        this.reconnect(connect)
    }

    private reconnect(connect: () => void): void {
        this.connectAttempts++
        const reconnectDelay = this.getReconnectDelay()
        console.log('[info]',`Attempting to reconnect in ${reconnectDelay}ms.`)
        this.delayTimer = setTimeout(this.createConnectWrapper(connect), reconnectDelay)
    }

    private clearDelayTimer(): void {
        if (!this.delayTimer) {
            return
        }
        clearTimeout(this.delayTimer)
        this.delayTimer = undefined
    }

    private createConnectWrapper(connect: () => void): () => void {
        return () => {
            this.clearDelayTimer()
            connect()
        }
    }

    private getReconnectDelay(): number {
        return 1000 * Math.pow(this.connectAttempts, 2)
    }
}
