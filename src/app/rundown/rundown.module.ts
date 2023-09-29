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
import { RundownHeaderComponent } from './components/rundown-header/rundown-header.component'
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {RundownHeaderContextMenuComponent} from "./components/rundown-header-context-menu/rundown-header-context-menu.component";
import {CdkMenuModule} from "@angular/cdk/menu";

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
    RundownHeaderComponent,
    RundownHeaderContextMenuComponent,
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
  ]
})
export class RundownModule { }
