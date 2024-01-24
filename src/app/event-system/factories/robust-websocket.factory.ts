import { RobustWebSocket } from '../services/robust-websocket.service'
import { ExponentiallyDelayedReconnectStrategy } from '../services/exponentially-delayed-reconnect-strategy.service'
import { Injectable } from '@angular/core'
import { Logger } from '../../core/abstractions/logger.service'
import { environment } from '../../../environments/environment'
import { ReconnectStrategy } from '../abstractions/reconnect-strategy.service'
import { FixedIntervalReconnectStrategy } from '../services/fixed-interval-reconnect-strategy.service'

@Injectable()
export class RobustWebSocketFactory {
  private readonly logger: Logger

  constructor(logger: Logger) {
    this.logger = logger.tag('RobustWebSocketFactory')
  }

  public createRobustWebSocket(): RobustWebSocket {
    const webSocketUrl = environment.eventStreamUrl
    return new RobustWebSocket(webSocketUrl, this.getReconnectStrategy(), this.logger)
  }

  private getReconnectStrategy(): ReconnectStrategy {
    if (environment.production) {
      return new ExponentiallyDelayedReconnectStrategy(this.logger)
    }
    return new FixedIntervalReconnectStrategy(this.logger)
  }
}
