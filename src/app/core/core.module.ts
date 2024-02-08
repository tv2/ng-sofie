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
import { RundownTimingService } from './services/rundown-timing.service'
import { RundownTimingContextStateService } from './services/rundown-timing-context-state.service'
import { ShowStyleVariantService } from './abstractions/show-style-variant.service'
import { HttpShowStyleVariantService } from './services/http/http-show-style-variant.service'
import { RundownService } from './abstractions/rundown.service'
import { HttpRundownService } from './services/http/http-rundown.service'
import { BasicRundownService } from './abstractions/basic-rundown.service'
import { HttpBasicRundownService } from './services/http/http-basic-rundown.service'
import { EntityParser } from './abstractions/entity-parser.service'
import { ZodEntityParser } from './parsers/zod-entity-parser.service'
import { ActionTriggerStateService } from './services/action-trigger-state.service'
import { ActionTriggerEventObserver } from './services/action-trigger-event-observer.service'
import { ActionTriggerEventParser } from './abstractions/action-trigger-event-parser'
import { ZodActionTriggerEventParser } from './parsers/zod-action-trigger-event-parser.service'
import { DomFileDownloadService } from './services/dom-file-download.service'
import { FortAwesomeIconService } from './services/http/http-icon.service'
import { IconService } from './abstractions/icon.service'
import { FileDownloadService } from './abstractions/file-download.service'
import { ZodMediaEventParserService } from './parsers/zod-media-event-parser.service'
import { MediaEventParser } from './abstractions/media-event-parser'
import { MediaEventObserver } from './services/media-event-observer.service'

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
    { provide: ShowStyleVariantService, useClass: HttpShowStyleVariantService },
    { provide: RundownService, useClass: HttpRundownService },
    { provide: BasicRundownService, useClass: HttpBasicRundownService },
    { provide: EntityParser, useClass: ZodEntityParser },
    { provide: IconService, useClass: FortAwesomeIconService },
    { provide: FileDownloadService, useClass: DomFileDownloadService },
    RundownEntityService,
    BasicRundownEntityService,
    SegmentEntityService,
    PartEntityService,
    RundownTimingService,
    RundownTimingContextStateService,
    ActionTriggerStateService,
    ActionTriggerEventObserver,
    { provide: ActionTriggerEventParser, useClass: ZodActionTriggerEventParser },
    MediaEventObserver,
    { provide: MediaEventParser, useClass: ZodMediaEventParserService },
  ],
})
export class CoreModule extends EnsureLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule)
  }
}
