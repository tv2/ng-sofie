import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { PieceLayer } from '../../../shared/enums/piece-layer'
import { RundownCursor } from '../../../core/models/rundown-cursor'
import { Part } from '../../../core/models/part'

@Component({
  selector: 'sofie-full-segment-timeline',
  templateUrl: './full-segment-timeline.component.html',
  styleUrls: ['./full-segment-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  public readonly pixelsPerSecond: number = 50

  public trackPart(_: number, part: Part): string {
    return part.id
  }
}
