import {NgModule} from '@angular/core'
import {SegmentComponent} from './components/segment/segment.component'
import {RundownComponent} from './components/rundown/rundown.component'
import {AdLibPieceComponent} from './components/ad-lib-piece/ad-lib-piece.component';
import {AdLibPieceIdentifierComponent} from './components/ad-lib-piece-identifier/ad-lib-piece-identifier.component'
import {SharedModule} from '../shared/shared.module'
import {RundownRoutesModule} from './rundown-routes.module';
import { TimelineMarkersComponent } from './components/timeline-markers/timeline-markers.component';
import { TimelinePlayheadComponent } from './components/timeline-playhead/timeline-playhead.component';
import { SegmentEndIndicatorComponent } from './components/segment-end-indicator/segment-end-indicator.component';
import { TimelineFlagComponent } from './components/timeline-flag/timeline-flag.component';
import { FollowPlayheadTimelineComponent } from './components/follow-playhead-timeline/follow-playhead-timeline.component';
import { ScrollableTimelineComponent } from './components/scrollable-timeline/scrollable-timeline.component'
import { MatCardModule } from "@angular/material/card";
import { OffsetablePartComponent } from './components/offsetable-part/offsetable-part.component'
import { PieceGroupService } from './services/piece-group.service'
import { OffsetablePieceComponent } from './components/offsetable-piece/offsetable-piece.component'

@NgModule({
  declarations: [
    SegmentComponent,
    RundownComponent,
    AdLibPieceComponent,
    AdLibPieceIdentifierComponent,
    TimelineMarkersComponent,
    TimelinePlayheadComponent,
    SegmentEndIndicatorComponent,
    TimelineFlagComponent,
    FollowPlayheadTimelineComponent,
    OffsetablePartComponent,
    OffsetablePieceComponent,
    ScrollableTimelineComponent,
  ],
  exports: [
    SegmentComponent
  ],
  imports: [
    RundownRoutesModule,
    SharedModule,
    MatCardModule,
  ],
  providers: [
    PieceGroupService,
  ]
})
export class RundownModule { }
