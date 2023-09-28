import {NgModule} from '@angular/core'
import {SegmentComponent} from './components/segment/segment.component'
import {PartComponent} from './components/part/part.component'
import {RundownComponent} from './components/rundown/rundown.component'
import {PieceComponent} from './components/piece/piece.component'
import {AdLibPieceComponent} from './components/ad-lib-piece/ad-lib-piece.component';
import {AdLibPieceIdentifierComponent} from './components/ad-lib-piece-identifier/ad-lib-piece-identifier.component'
import {SharedModule} from '../shared/shared.module'
import {RundownRoutesModule} from './rundown-routes.module';
import { TimelineMarkersComponent } from './components/timeline-markers/timeline-markers.component';
import { TimelinePlayheadComponent } from './components/timeline-playhead/timeline-playhead.component';
import { TimelineNextIndicatorComponent } from './components/timeline-next-indicator/timeline-next-indicator.component';
import { FullSegmentTimelineComponent } from './components/full-segment-timeline/full-segment-timeline.component';
import { RundownViewHeaderComponent } from '../rundown-view-header/rundown-view-header.component'
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    SegmentComponent,
    PartComponent,
    RundownComponent,
    PieceComponent,
    AdLibPieceComponent,
    AdLibPieceIdentifierComponent,
    TimelineMarkersComponent,
    TimelinePlayheadComponent,
    TimelineNextIndicatorComponent,
    FullSegmentTimelineComponent,
    RundownViewHeaderComponent,
  ],
  exports: [
    SegmentComponent
  ],
  imports: [
    RundownRoutesModule,
    SharedModule,
    MatCardModule,
    MatButtonModule,
  ]
})
export class RundownModule { }
