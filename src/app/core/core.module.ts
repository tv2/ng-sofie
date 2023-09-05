import { NgModule, Optional, SkipSelf } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EnsureLoadedOnceGuard } from './ensure-loaded-once.guard'
import { HttpErrorService } from './services/http-error.service'
import { HttpClientModule } from '@angular/common/http'
import { RundownPlaylistService } from './services/rundown-playlist.service'
import { RundownService } from './services/rundown.service'
import { AdLibPieceService } from './services/ad-lib-piece.service'
import { ConnectionStatusObserver } from './services/events/connection-status-observer.service'
import { EventObserver } from './services/events/event-observer.service'
import { WebSocketEventObserver } from './services/events/websocket-event-observer'
import { RundownEventObserver } from './services/events/rundown-event-observer.service'
import { RundownStateService } from './services/rundown-state.service'
import { RobustWebSocketFactory } from './services/events/robust-websocket.factory'
import { RundownEventParser } from './services/events/rundown-event-parser.service'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    HttpErrorService,
    HttpClientModule,
    RobustWebSocketFactory,
    RundownPlaylistService,
    RundownService,
    AdLibPieceService,
    { provide: EventObserver, useClass: WebSocketEventObserver },
    ConnectionStatusObserver,
    RundownEventObserver,
    RundownEventParser,
    RundownStateService,
  ]
})
export class CoreModule extends EnsureLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
