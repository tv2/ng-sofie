import { NgModule } from '@angular/core'
import { SegmentComponent } from './components/segment/segment.component'
import { RundownComponent } from './components/rundown/rundown.component'
import { SharedModule } from '../shared/shared.module'
import { RundownViewRoutesModule } from './rundown-view-routes.module'
import { TimelineMarkersComponent } from './components/timeline-markers/timeline-markers.component'
import { TimelinePlayheadComponent } from './components/timeline-playhead/timeline-playhead.component'
import { RundownHeaderComponent } from './components/rundown-header/rundown-header.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
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
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { ProducerShelfModule } from '../producer-shelf/producer-shelf.module'
import { RundownHeaderPanelComponent } from './components/rundown-header-panel/rundown-header-panel.component'
import { RundownViewComponent } from './components/rundown-view/rundown-view.component'
import { KeyBindingService } from './abstractions/key-binding.service'
import { SegmentContextMenuComponent } from './components/segment-context-menu/segment-context-menu.component'
import { PartContextMenuComponent } from './components/part-context-menu/part-context-menu.component'
import { KeyboardConfigurationService } from './abstractions/keyboard-configuration.service'
import { ProducerKeyboardConfigurationService } from './services/producer-keyboard-configuration.service'
import { SystemKeyBindingFactory } from './factories/system-key-binding-factory.service'
import { OnAirDetailsPanelComponent } from './components/on-air-details-panel/on-air-details-panel.component'
import { CountdownLabelComponent } from './components/countdown-label/countdown-label.component'
import { ActionTriggerProducerKeyBindingService } from './services/action-trigger-producer-key-binding.service'
import { MiniShelfComponent } from './components/mini-shelf/mini-shelf.component'
import { PieceTooltipComponent } from './components/rundown-tooltips/piece-tooltip/piece-tooltip.component'
import { MiniShelfCycleService } from './services/mini-shelf-cycle.service'
import { MiniShelfNavigationService } from './services/mini-shelf-navigation.service'
import { Tv2PieceTooltipContentFieldService } from './services/tv2-piece-tooltip-content-field.service'
import { InvalidSegmentComponent } from './components/invalid-segment/invalid-segment.component'
import { StickySegmentComponent } from './components/sticky-segment/sticky-segment.component'
import { AttentionBannerComponent } from './components/attention-banner/attention-banner.component'
import { InvalidPartTooltipComponent } from './components/rundown-tooltips/invalid-part-tooltip/invalid-part-tooltip.component'

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
    ScrollableTimelineComponent,
    RundownHeaderPanelComponent,
    SegmentContextMenuComponent,
    PartContextMenuComponent,
    RundownViewComponent,
    CountdownLabelComponent,
    MiniShelfComponent,
    PieceTooltipComponent,
    InvalidSegmentComponent,
    StickySegmentComponent,
    AttentionBannerComponent,
    InvalidPartTooltipComponent,
  ],
  exports: [SegmentComponent],
  providers: [
    Tv2PieceGroupService,
    { provide: KeyBindingService, useClass: ActionTriggerProducerKeyBindingService },
    Tv2PieceTooltipContentFieldService,
    { provide: KeyboardConfigurationService, useClass: ProducerKeyboardConfigurationService },
    MiniShelfCycleService,
    MiniShelfNavigationService,
    SystemKeyBindingFactory,
  ],
  imports: [SharedModule, RundownViewRoutesModule, MatCardModule, MatButtonModule, CdkMenuModule, ProducerShelfModule],
})
export class RundownViewModule {}
