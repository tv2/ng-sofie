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
import { SegmentEndIndicatorComponent } from './components/segment-end-indicator/segment-end-indicator.component';
import { TimelineFlagComponent } from './components/timeline-flag/timeline-flag.component';
import { MatCardModule } from "@angular/material/card";
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
    EditorialLineComponent,
    SegmentEndIndicatorComponent,
    TimelineFlagComponent,
  ],
  exports: [
    SegmentComponent
  ],
  imports: [
    RundownRoutesModule,
    SharedModule,
    MatCardModule,
  ]
})
export class RundownModule { }
