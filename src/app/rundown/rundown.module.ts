import {NgModule} from '@angular/core'
import {SegmentComponent} from './components/segment/segment.component'
import {PartComponent} from './components/part/part.component'
import {RundownComponent} from './components/rundown/rundown.component'
import {PieceComponent} from './components/piece/piece.component'
import {AdLibPieceComponent} from './components/ad-lib-piece/ad-lib-piece.component';
import {AdLibPieceIdentifierComponent} from './components/ad-lib-piece-identifier/ad-lib-piece-identifier.component'
import {SharedModule} from '../shared/shared.module'
import {RundownRoutesModule} from './rundown-routes.module';
import { TimelineComponent } from './components/timeline/timeline.component';
import { TimelinePlayheadComponent } from './components/timeline-playhead/timeline-playhead.component';
import { TimelineNextCursorComponent } from './components/timeline-next-cursor/timeline-next-cursor.component'

@NgModule({
  declarations: [
    SegmentComponent,
    PartComponent,
    RundownComponent,
    PieceComponent,
    AdLibPieceComponent,
    AdLibPieceIdentifierComponent,
    TimelineComponent,
    TimelinePlayheadComponent,
    TimelineNextCursorComponent,
  ],
  exports: [
    SegmentComponent
  ],
  imports: [
    RundownRoutesModule,
    SharedModule,
  ]
})
export class RundownModule { }
