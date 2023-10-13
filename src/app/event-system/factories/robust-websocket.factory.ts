import { RobustWebSocket } from '../services/robust-websocket.service'
import { ExponentiallyDelayedReconnectStrategy } from '../services/exponentially-delayed-reconnect-strategy.service'
import { Injectable } from '@angular/core'
import { Logger } from '../../core/abstractions/logger.service'
import { environment } from '../../../environments/environment'

@Injectable()
export class RobustWebSocketFactory {
  private readonly logger: Logger

  constructor(logger: Logger) {
    this.logger = logger.tag('RobustWebSocketFactory')
  }

  public createRobustWebSocket(): RobustWebSocket {
    // TODO: Move to configuration
    const webSocketUrl = environment.eventStreamUrl
    return new RobustWebSocket(webSocketUrl, new ExponentiallyDelayedReconnectStrategy(this.logger), this.logger)
  }
}
