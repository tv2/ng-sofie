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
import { Tv2PieceGroupService } from './services/tv2-piece-group.service'
import { OffsetablePieceComponent } from './components/offsetable-piece/offsetable-piece.component'
import { EditorialLineComponent } from './components/editorial-line/editorial-line.component'
import { MatCardModule } from '@angular/material/card'
import { ProducerShelfModule } from '../producer-shelf/producer-shelf.module'
import { RundownHeaderPanelComponent } from './components/rundown-header-panel/rundown-header-panel.component'
import { RundownViewComponent } from './components/rundown-view/rundown-view.component'
import { KeyBindingService } from './abstractions/key-binding.service'
import { Tv2ActionGroupService } from './services/tv2-action-group.service'
import { SegmentContextMenuComponent } from './components/segment-context-menu/segment-context-menu.component'
import { PartContextMenuComponent } from './components/part-context-menu/part-context-menu.component'
import { KeyboardConfigurationService } from './abstractions/keyboard-configuration.service'
import { ProducerKeyboardConfigurationService } from './services/producer-keyboard-configuration.service'
import { KeyBindingFactory } from './factories/key-binding.factory'
import { OnAirDetailsPanelComponent } from './components/on-air-details-panel/on-air-details-panel.component'
import { CountdownLabelComponent } from './components/countdown-label/countdown-label.component'
import { ActionTriggerProducerKeyBindingService } from './services/action-trigger-producer-key-binding.service'
import { MiniShelfComponent } from './components/mini-shelf/mini-shelf.component'
import { VideoHoverScrubComponent } from './components/rundown-tooltips/video-hover-scrub/video-hover-scrub.component'
import { MiniShelfTooltipComponent } from './components/rundown-tooltips/mini-shelf-tooltip/mini-shelf-tooltip.component'
import { PieceTooltipComponent } from './components/rundown-tooltips/piece-tooltip/piece-tooltip.component'
import { MiniShelfCycleService } from './services/mini-shelf-cycle.service'
import { MiniShelfNavigationService } from './services/mini-shelf-navigation.service'
import { OffsetableStackComponent } from './components/offsetable-stack/offsetable-stack.component'

@NgModule({
  declarations: [
    SegmentComponent,
    RundownComponent,
    TimelineMarkersComponent,
    TimelinePlayheadComponent,
    RundownHeaderComponent,
    OnAirDetailsPanelComponent,
    RundownHeaderContextMenuComponent,
    EditorialLineComponent,
    SegmentEndIndicatorComponent,
    TimelineFlagComponent,
    FollowPlayheadTimelineComponent,
    OffsetablePartComponent,
    OffsetablePieceComponent,
    OffsetableStackComponent,
    ScrollableTimelineComponent,
    RundownHeaderPanelComponent,
    SegmentContextMenuComponent,
    PartContextMenuComponent,
    RundownViewComponent,
    CountdownLabelComponent,
    MiniShelfComponent,
    VideoHoverScrubComponent,
    PieceTooltipComponent,
    MiniShelfTooltipComponent,
  ],
  exports: [SegmentComponent],
  providers: [
    Tv2PieceGroupService,
    { provide: KeyBindingService, useClass: ActionTriggerProducerKeyBindingService },
    Tv2ActionGroupService,
    { provide: KeyboardConfigurationService, useClass: ProducerKeyboardConfigurationService },
    MiniShelfCycleService,
    MiniShelfNavigationService,
    KeyBindingFactory,
  ],
  imports: [SharedModule, RundownViewRoutesModule, ProducerShelfModule, MatCardModule, MatButtonModule, CdkMenuModule],
})
export class RundownViewModule {}
