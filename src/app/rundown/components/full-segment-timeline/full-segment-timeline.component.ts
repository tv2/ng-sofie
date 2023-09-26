import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { PieceLayer } from '../../../shared/enums/piece-layer'
import { RundownCursor } from '../../../core/models/rundown-cursor'

@Component({
  selector: 'sofie-full-segment-timeline',
  templateUrl: './full-segment-timeline.component.html',
  styleUrls: ['./full-segment-timeline.component.scss'],
})
export class FullSegmentTimelineComponent {
  @Input()
  public segment: Segment

  @Input()
  public pieceLayers: PieceLayer[]

  @Input()
  public time: number

  @Output()
  public setNextEvent: EventEmitter<RundownCursor> = new EventEmitter()

  public pixelsPerSecond: number = 60
}
