import {NgModule} from '@angular/core'
import {SegmentComponent} from './components/segment/segment.component'
import {PartComponent} from './components/part/part.component'
import {RundownComponent} from './components/rundown/rundown.component'
import {PieceComponent} from './components/piece/piece.component'
import {SharedModule} from '../shared/shared.module'
import {RundownRoutesModule} from './rundown-routes.module';
import { TimelineMarkersComponent } from './components/timeline-markers/timeline-markers.component';
import { TimelinePlayheadComponent } from './components/timeline-playhead/timeline-playhead.component';
import { FullSegmentTimelineComponent } from './components/full-segment-timeline/full-segment-timeline.component';
import { RundownHeaderComponent } from './components/rundown-header/rundown-header.component'
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {RundownHeaderContextMenuComponent} from "./components/rundown-header-context-menu/rundown-header-context-menu.component";
import {CdkMenuModule} from "@angular/cdk/menu";
import { SegmentEndIndicatorComponent } from './components/segment-end-indicator/segment-end-indicator.component';
import { TimelineFlagComponent } from './components/timeline-flag/timeline-flag.component';
import { FollowPlayheadTimelineComponent } from './components/follow-playhead-timeline/follow-playhead-timeline.component';
import { OffsetablePartComponent } from './components/offsetable-part/offsetable-part.component'
import { PieceGroupService } from './services/piece-group.service'
import { OffsetablePieceComponent } from './components/offsetable-piece/offsetable-piece.component'
import {EditorialLineComponent} from "./components/editorial-line/editorial-line.component";

@NgModule({
  declarations: [
    SegmentComponent,
    PartComponent,
    RundownComponent,
    PieceComponent,
    TimelineMarkersComponent,
    TimelinePlayheadComponent,
    FullSegmentTimelineComponent,
    RundownHeaderComponent,
    RundownHeaderContextMenuComponent,
    EditorialLineComponent,
    SegmentEndIndicatorComponent,
    TimelineFlagComponent,
    FollowPlayheadTimelineComponent,
    OffsetablePartComponent,
    OffsetablePieceComponent,
  ],
  exports: [
    SegmentComponent
  ],
  imports: [
    RundownRoutesModule,
    SharedModule,
    MatCardModule,
    MatButtonModule,
    CdkMenuModule,
  ],
  providers: [
    PieceGroupService,
  ]
})
export class RundownModule { }
