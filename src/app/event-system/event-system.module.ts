import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventObserver } from './abstractions/event-observer.interface'
import { WebSocketEventObserver } from './services/websocket-event-observer.service'
import { RobustWebSocketFactory } from './factories/robust-websocket.factory'


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    RobustWebSocketFactory,
    { provide: EventObserver, useClass: WebSocketEventObserver },
  ]
})
export class EventSystemModule { }
