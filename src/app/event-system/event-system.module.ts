import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RobustWebSocketFactory } from './services/robust-websocket.factory'
import { EventObserver } from './services/event-observer.interface'
import { WebSocketEventObserver } from './services/websocket-event-observer.service'
import { ConnectionStatusObserver } from './services/connection-status-observer.service'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    RobustWebSocketFactory,
    { provide: EventObserver, useClass: WebSocketEventObserver },
    ConnectionStatusObserver,
  ]
})
export class EventSystemModule { }
