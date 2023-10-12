import { ReconnectStrategy } from '../abstractions/reconnect-strategy.service'
import { Logger } from '../../core/abstractions/logger.service'

export class FixedIntervalReconnectStrategy implements ReconnectStrategy {
  private readonly logger: Logger
  private connectAttempts: number = 0
  private delayTimer?: NodeJS.Timeout

  constructor(logger: Logger) {
    this.logger = logger.tag('ExponentiallyDelayedReconnectStrategy')
  }

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
    this.logger.info(`Attempting to reconnect in ${reconnectDelay}ms.`)
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
    return 2000
  }
}
