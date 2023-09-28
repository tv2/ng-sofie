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
import { RundownEntityService } from './services/models/rundown-entity.service'
import { SegmentEntityService } from './services/models/segment-entity.service'
import { PartEntityService } from './services/models/part-entity.service'
import { BasicRundownEntityService } from './services/models/basic-rundown-entity.service'

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
    { provide: RundownService, useClass: HttpRundownService },
    ConnectionStatusObserver,
    RundownEventObserver,
    { provide: BasicRundownService, useClass: HttpBasicRundownService },
    RundownStateService,
    BasicRundownStateService,
    { provide: RundownEventParser, useClass: ZodRundownEventParser },
    { provide: EntityParser, useClass: ZodEntityParser },
    RundownEntityService,
    BasicRundownEntityService,
    SegmentEntityService,
    PartEntityService,
  ]
})
export class CoreModule extends EnsureLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
