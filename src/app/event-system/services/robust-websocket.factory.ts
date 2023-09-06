import { RobustWebSocket } from './robust-websocket.service'
import { ExponentiallyDelayedReconnectStrategy } from './exponentially-delayed-reconnect-strategy.service'
import { Injectable } from '@angular/core'

@Injectable()
export class RobustWebSocketFactory {
    public createRobustWebSocket(): RobustWebSocket {
        const webSocketUrl = 'ws://localhost:3006'
        return new RobustWebSocket(webSocketUrl, new ExponentiallyDelayedReconnectStrategy())
    }
}
