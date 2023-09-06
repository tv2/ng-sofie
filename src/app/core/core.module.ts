import { NgModule, Optional, SkipSelf } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EnsureLoadedOnceGuard } from './ensure-loaded-once.guard'
import { HttpErrorService } from './services/http-error.service'
import { HttpClientModule } from '@angular/common/http'
import { HttpBasicRundownService } from './services/http-basic-rundown.service'
import { HttpRundownService } from './services/http-rundown.service'
import { AdLibPieceService } from './services/ad-lib-piece.service'
import { ConnectionStatusObserver } from './services/events/connection-status-observer.service'
import { EventObserver } from './services/events/event-observer.interface'
import { WebSocketEventObserver } from './services/events/websocket-event-observer.service'
import { RundownEventObserver } from './services/events/rundown-event-observer.service'
import { RundownStateService } from './services/rundown-state.service'
import { RobustWebSocketFactory } from './services/events/robust-websocket.factory'
import { RundownEventParser } from './services/events/rundown-event-parser.interface'
import { BasicRundownStateService } from './services/basic-rundown-state.service'
import { BasicRundownService } from './interfaces/basic-rundown-service'
import { EntityParser } from './services/entity-parser.interface'
import { ZodEntityParser } from './services/zod-entity-parser.service'
import { ZodRundownEventParser } from './services/events/zod-rundown-event-parser.service'

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
    HttpBasicRundownService,
    HttpRundownService,
    AdLibPieceService,
    { provide: EventObserver, useClass: WebSocketEventObserver },
    ConnectionStatusObserver,
    RundownEventObserver,
    { provide: BasicRundownService, useClass: HttpBasicRundownService },
    RundownStateService,
    BasicRundownStateService,
    { provide: RundownEventParser, useClass: ZodRundownEventParser },
    { provide: EntityParser, useClass: ZodEntityParser },
  ]
})
export class CoreModule extends EnsureLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
