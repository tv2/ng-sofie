import { NgModule, Optional, SkipSelf } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EnsureLoadedOnceGuard } from './ensure-loaded-once.guard'
import { ConnectionStatusObserver } from './services/connection-status-observer.service'
import { RundownEventObserver } from './services/rundown-event-observer.service'
import { RundownStateService } from './services/rundown-state.service'
import { RundownEventValidator } from './abstractions/rundown-event-validator.service'
import { BasicRundownStateService } from './services/basic-rundown-state.service'
import { ZodRundownEventValidator } from './validators/zod-rundown-event-validator.service'
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
import { EntityValidator } from './abstractions/entity-validator.service'
import { ZodEntityValidator } from './validators/zod-entity-validator.service'
import { ActionTriggerStateService } from './services/action-trigger-state.service'
import { ActionTriggerEventObserver } from './models/action-trigger-event-observer.service'
import { ActionTriggerEventValidator } from './abstractions/action-trigger-event-validator.service'
import { ZodActionTriggerEventValidator } from './validators/zod-action-trigger-event-validator.service'

@NgModule({
  declarations: [],
  imports: [CommonModule, EventSystemModule],
  providers: [
    ConnectionStatusObserver,
    RundownEventObserver,
    RundownStateService,
    BasicRundownStateService,
    ShowStyleVariantStateService,
    { provide: RundownEventValidator, useClass: ZodRundownEventValidator },
    { provide: ShowStyleVariantService, useClass: HttpShowStyleVariantService },
    { provide: RundownService, useClass: HttpRundownService },
    { provide: BasicRundownService, useClass: HttpBasicRundownService },
    { provide: EntityValidator, useClass: ZodEntityValidator },
    RundownEntityService,
    BasicRundownEntityService,
    SegmentEntityService,
    PartEntityService,
    RundownTimingService,
    RundownTimingContextStateService,
    ActionTriggerStateService,
    ActionTriggerEventObserver,
    { provide: ActionTriggerEventValidator, useClass: ZodActionTriggerEventValidator },
  ],
})
export class CoreModule extends EnsureLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule)
  }
}
