import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { PieceLayer } from '../../../shared/enums/piece-layer'

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
  public setNextEvent: EventEmitter<{segmentId: string, partId: string}> = new EventEmitter()

  public pixelsPerSecond: number = 30

  public emitSetNextEvent(partId: string): void {
    this.setNextEvent.emit({ segmentId: this.segment.id, partId})
  }
}
