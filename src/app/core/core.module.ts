import { NgModule, Optional, SkipSelf } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EnsureLoadedOnceGuard } from './ensure-loaded-once.guard'
import { HttpErrorService } from './services/http-error.service'
import { HttpClientModule } from '@angular/common/http'
import { HttpBasicRundownService } from './services/http-basic-rundown.service'
import { HttpRundownService } from './services/http-rundown.service'
import { HttpAdLibPieceService } from './services/http-ad-lib-piece.service'
import { RundownEventObserver } from './services/events/rundown-event-observer.service'
import { RundownStateService } from './services/rundown-state.service'
import { RundownEventParser } from './services/events/rundown-event-parser.interface'
import { BasicRundownStateService } from './services/basic-rundown-state.service'
import { BasicRundownService } from './interfaces/basic-rundown-service.interface'
import { EntityParser } from './services/entity-parser.interface'
import { ZodEntityParser } from './services/zod-entity-parser.service'
import { ZodRundownEventParser } from './services/events/zod-rundown-event-parser.service'
import { EventSystemModule } from '../event-system/event-system.module'
import { AdLibPieceService } from './services/ad-lib-piece-service.interface'

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
    HttpAdLibPieceService,
    RundownEventObserver,
    { provide: BasicRundownService, useClass: HttpBasicRundownService },
    RundownStateService,
    BasicRundownStateService,
    { provide: AdLibPieceService, useClass: HttpAdLibPieceService },
    { provide: RundownEventParser, useClass: ZodRundownEventParser },
    { provide: EntityParser, useClass: ZodEntityParser },
  ]
})
export class CoreModule extends EnsureLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
