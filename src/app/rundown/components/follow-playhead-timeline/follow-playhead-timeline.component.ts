import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { Part } from '../../../core/models/part'
import { Segment } from '../../../core/models/segment'
import { PieceLayer } from '../../../shared/enums/piece-layer'

@Component({
  selector: 'sofie-follow-playhead-timeline',
  templateUrl: './follow-playhead-timeline.component.html',
  styleUrls: ['./follow-playhead-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowPlayheadTimelineComponent implements OnChanges {
  @Input()
  public time: number

  @Input()
  public segment: Segment

  @Input()
  public pieceLayers: PieceLayer[]

  public previousPart?: Part
  public onAirPart?: Part
  public futureParts: Part[] = []

  public readonly pixelsPerSecond: number = 60
  public readonly playheadInsetDuration: number = 1000 * 100 / this.pixelsPerSecond
  public readonly playheadPostDisplayDuration: number = 1000 * 100 / this.pixelsPerSecond

  public getPartTimeOffset(part: Part): number {
    return Math.max(0, Date.now() - (part.executedAt + part.playedDuration))
  }

  public get onAirPartTimeOffset(): number {
    if (!this.onAirPart) {
      return 0
    }
    const timeOffsetSinceTaken = Date.now() - this.onAirPart.executedAt
    const invertedPlayheadDuration = this.playheadInsetDuration - Math.min(this.time, this.playheadInsetDuration)
    const previousPartWidth = this.previousPart ? this.previousPart.playedDuration : 0
    console.log(invertedPlayheadDuration)
    return Math.max(0, timeOffsetSinceTaken - invertedPlayheadDuration)
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const onAirPartIndex: number = this.segment.parts.findIndex(part => part.isOnAir)
    if (onAirPartIndex < 0) {
      return
    }
    this.previousPart = this.segment.parts[onAirPartIndex - 1]
    this.onAirPart = this.segment.parts[onAirPartIndex]
    this.futureParts = this.segment.parts.slice(onAirPartIndex + 1)
  }

}
