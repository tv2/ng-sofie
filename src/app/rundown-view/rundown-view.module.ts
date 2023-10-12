import { NgModule } from '@angular/core'
import { SegmentComponent } from './components/segment/segment.component'
import { RundownComponent } from './components/rundown/rundown.component'
import { SharedModule } from '../shared/shared.module'
import { RundownViewRoutesModule } from './rundown-view-routes.module'
import { TimelineMarkersComponent } from './components/timeline-markers/timeline-markers.component'
import { TimelinePlayheadComponent } from './components/timeline-playhead/timeline-playhead.component'
import { RundownHeaderComponent } from './components/rundown-header/rundown-header.component'
import { MatButtonModule } from '@angular/material/button'
import { RundownHeaderContextMenuComponent } from './components/rundown-header-context-menu/rundown-header-context-menu.component'
import { CdkMenuModule } from '@angular/cdk/menu'
import { SegmentEndIndicatorComponent } from './components/segment-end-indicator/segment-end-indicator.component'
import { TimelineFlagComponent } from './components/timeline-flag/timeline-flag.component'
import { FollowPlayheadTimelineComponent } from './components/follow-playhead-timeline/follow-playhead-timeline.component'
import { ScrollableTimelineComponent } from './components/scrollable-timeline/scrollable-timeline.component'
import { OffsetablePartComponent } from './components/offsetable-part/offsetable-part.component'
import { PieceGroupService } from './services/piece-group.service'
import { OffsetablePieceComponent } from './components/offsetable-piece/offsetable-piece.component'
import { EditorialLineComponent } from './components/editorial-line/editorial-line.component'
import { MatCardModule } from '@angular/material/card'
import { ProducerShelfModule } from '../producer-shelf/producer-shelf.module'
import { RundownHeaderPanelComponent } from './components/rundown-header-panel/rundown-header-panel.component'
import { RundownViewComponent } from './components/rundown-view/rundown-view.component'
import { ProducerKeyBindingService } from './abstractions/producer-key-binding.service'
import { HardcodedProducerKeyBindingService } from './services/hardcoded-producer-key-binding.service'
import { Tv2ActionGroupService } from './services/tv2-action-group.service'
import { KeyboardConfigurationService } from './abstractions/keyboard-configuration.service'
import { ProducerKeyboardConfigurationService } from './services/producer-keyboard-configuration.service'
import { KeyBindingFactory } from './factories/key-binding.factory'

@NgModule({
  declarations: [
    SegmentComponent,
    RundownComponent,
    TimelineMarkersComponent,
    TimelinePlayheadComponent,
    RundownHeaderComponent,
    RundownHeaderContextMenuComponent,
    EditorialLineComponent,
    SegmentEndIndicatorComponent,
    TimelineFlagComponent,
    FollowPlayheadTimelineComponent,
    OffsetablePartComponent,
    OffsetablePieceComponent,
    ScrollableTimelineComponent,
    RundownHeaderPanelComponent,
    RundownViewComponent,
  ],
  exports: [SegmentComponent],
  providers: [
    PieceGroupService,
    { provide: ProducerKeyBindingService, useClass: HardcodedProducerKeyBindingService },
    Tv2ActionGroupService,
    { provide: KeyboardConfigurationService, useClass: ProducerKeyboardConfigurationService },
    KeyBindingFactory,
  ],
  imports: [SharedModule, RundownViewRoutesModule, ProducerShelfModule, MatCardModule, MatButtonModule, CdkMenuModule],
})
export class RundownViewModule {}
