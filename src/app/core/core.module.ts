import { NgModule, Optional, SkipSelf } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EnsureLoadedOnceGuard } from './ensure-loaded-once.guard'
import { ConnectionStatusObserver } from './services/connection-status-observer.service'
import { RundownEventObserver } from './services/rundown-event-observer.service'
import { RundownStateService } from './services/rundown-state.service'
import { RundownEventParser } from './abstractions/rundown-event.parser'
import { BasicRundownStateService } from './services/basic-rundown-state.service'
import { ZodRundownEventParser } from './parsers/zod-rundown-event-parser.service'
import { EventSystemModule } from '../event-system/event-system.module'
import { ShowStyleVariantStateService } from './services/show-style-variant-state.service'
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
  imports: [CommonModule, EventSystemModule],
  providers: [
    ConnectionStatusObserver,
    RundownEventObserver,
    RundownStateService,
    BasicRundownStateService,
    ShowStyleVariantStateService,
    { provide: RundownEventParser, useClass: ZodRundownEventParser },
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
