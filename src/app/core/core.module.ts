import { NgModule, Optional, SkipSelf } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EnsureLoadedOnceGuard } from './ensure-loaded-once.guard'
import { HttpErrorService } from './services/http-error.service'
import { HttpClientModule } from '@angular/common/http'
import { HttpBasicRundownService } from './services/http-basic-rundown.service'
import { HttpRundownService } from './services/http-rundown.service'
import { AdLibPieceService } from './abstractions/ad-lib-piece.service'
import { HttpAdLibPieceService } from './services/http-ad-lib-piece.service'
import { ConnectionStatusObserver } from './services/connection-status-observer.service'
import { RundownEventObserver } from './services/rundown-event-observer.service'
import { RundownStateService } from './services/rundown-state.service'
import { RundownEventParser } from './abstractions/rundown-event.parser'
import { BasicRundownStateService } from './services/basic-rundown-state.service'
import { BasicRundownService } from './abstractions/basic-rundown.service'
import { EntityParserService } from './abstractions/entity-parser.service'
import { ZodEntityParser } from './parsers/zod-entity-parser.service'
import { ZodRundownEventParser } from './parsers/zod-rundown-event-parser.service'
import { EventSystemModule } from '../event-system/event-system.module'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    EventSystemModule,
  ],
  providers: [
    HttpErrorService,
    HttpClientModule,
    HttpBasicRundownService,
    HttpRundownService,
    { provide: AdLibPieceService, useClass: HttpAdLibPieceService },
    ConnectionStatusObserver,
    RundownEventObserver,
    { provide: BasicRundownService, useClass: HttpBasicRundownService },
    RundownStateService,
    BasicRundownStateService,
    { provide: RundownEventParser, useClass: ZodRundownEventParser },
    { provide: EntityParserService, useClass: ZodEntityParser },
  ]
})
export class CoreModule extends EnsureLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
