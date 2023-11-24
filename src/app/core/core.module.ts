import { NgModule, Optional, SkipSelf } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EnsureLoadedOnceGuard } from './ensure-loaded-once.guard'
import { HttpErrorService } from './services/http-error.service'
import { HttpClientModule } from '@angular/common/http'
import { HttpBasicRundownService } from './services/http-basic-rundown.service'
import { HttpRundownService } from './services/http-rundown.service'
import { ConnectionStatusObserver } from './services/connection-status-observer.service'
import { RundownEventObserver } from './services/rundown-event-observer.service'
import { RundownStateService } from './services/rundown-state.service'
import { RundownEventParser } from './abstractions/rundown-event.parser'
import { BasicRundownStateService } from './services/basic-rundown-state.service'
import { BasicRundownService } from './abstractions/basic-rundown.service'
import { EntityParser } from './abstractions/entity-parser.service'
import { ZodEntityParser } from './parsers/zod-entity-parser.service'
import { ZodRundownEventParser } from './parsers/zod-rundown-event-parser.service'
import { EventSystemModule } from '../event-system/event-system.module'
import { RundownService } from './abstractions/rundown.service'
import { HttpShowStyleVariantService } from './services/http-show-style-variant.service'
import { ShowStyleVariantStateService } from './services/show-style-variant-state.service'
import { ShowStyleVariantService } from './abstractions/show-style-variant.service'
import { RundownEntityService } from './services/models/rundown-entity.service'
import { SegmentEntityService } from './services/models/segment-entity.service'
import { PartEntityService } from './services/models/part-entity.service'
import { BasicRundownEntityService } from './services/models/basic-rundown-entity.service'
import { Logger } from './abstractions/logger.service'
import { Tv2LoggerService } from './services/tv2-logger.service'
import { RundownTimingService } from './services/rundown-timing.service'
import { RundownTimingContextStateService } from './services/rundown-timing-context-state.service'

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, EventSystemModule],
  providers: [
    HttpErrorService,
    HttpClientModule,
    HttpBasicRundownService,
    { provide: ShowStyleVariantService, useClass: HttpShowStyleVariantService },
    { provide: RundownService, useClass: HttpRundownService },
    ConnectionStatusObserver,
    RundownEventObserver,
    { provide: BasicRundownService, useClass: HttpBasicRundownService },
    RundownStateService,
    BasicRundownStateService,
    ShowStyleVariantStateService,
    { provide: RundownEventParser, useClass: ZodRundownEventParser },
    { provide: EntityParser, useClass: ZodEntityParser },
    { provide: Logger, useClass: Tv2LoggerService },
    RundownEntityService,
    BasicRundownEntityService,
    SegmentEntityService,
    PartEntityService,
    RundownTimingService,
    RundownTimingContextStateService,
  ],
})
export class CoreModule extends EnsureLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule)
  }
}
