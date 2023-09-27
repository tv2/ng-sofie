import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core'
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

  public readonly pixelsPerSecond: number = 60

  public onAirPart?: Part
  public previousParts: Part[] = []
  public futureParts: Part[] = []

  public readonly playheadInAnimationDurationInMs: number = 100 * 1000 / this.pixelsPerSecond
  public readonly postPlayheadDurationInMs: number = 100 * 1000 / this.pixelsPerSecond

  public ngOnChanges() {
    const onAirPartIndex: number = this.segment.parts.findIndex(part => part.isOnAir)
    if (onAirPartIndex < 0) {
      return
    }
    this.onAirPart = this.segment.parts[onAirPartIndex]
    this.previousParts = this.getPreviousParts(onAirPartIndex)
    this.futureParts = this.getFutureParts(onAirPartIndex)
  }

  private getPreviousParts(onAirPartIndex: number): Part[] {
    return this.segment.parts
        .slice(0, onAirPartIndex)
        .filter(part => this.getDisplayDurationInMs(part) > 0)
  }

  private getDisplayDurationInMs(part: Part): number {
    const playheadEpoch: number = Date.now()
    const takenOffAirAt: number = part.executedAt + part.playedDuration
    const durationInMsSinceTakenOfAir = playheadEpoch - takenOffAirAt
    return this.playheadInAnimationDurationInMs - durationInMsSinceTakenOfAir
  }

  private getFutureParts(onAirPartIndex: number): Part[] {
    return this.segment.parts.slice(onAirPartIndex + 1)
  }

  public getOnAirPartOffsetInMs(): number {
    if (!this.onAirPart) {
      return 0
    }
    return Math.max(0, Date.now() - this.onAirPart.executedAt - this.playheadInAnimationDurationInMs)
  }

  public getPreviousPartOffsetInMs(part: Part): number {
    if (!this.isFirstPartInPreviousParts(part)) {
      return 0
    }

    const displayDurationInMs: number = this.getDisplayDurationInMs(part)
    return Math.max(0, part.playedDuration - displayDurationInMs)
  }

  private isFirstPartInPreviousParts(part: Part): boolean {
    return this.previousParts[0]?.id === part.id
  }
}
//export class FollowPlayheadTimelineComponent implements OnChanges {
//  @Input()
//  public time: number
//
//  @Input()
//  public segment: Segment
//
//  @Input()
//  public pieceLayers: PieceLayer[]
//
//  public onAirPart?: Part
//  public previousParts: Part[]
//  public futureParts: Part[] = []
//
//  public readonly pixelsPerSecond: number = 60
//  public readonly playheadInsetDuration: number = 1000 * 100 / this.pixelsPerSecond
//  public readonly playheadPostDisplayDuration: number = 1000 * 100 / this.pixelsPerSecond
//
//  public getNonFirstPreviousPartTimeOffset(part: Part): number {
//    return part.playedDuration
//  }
//
//  public getFirstPreviousPartTimeOffset(part: Part): number {
//    if (!this.onAirPart) {
//      return 0
//    }
//    const takenOffAirAt: number = part.executedAt + part.playedDuration
//    const timeFromPartToPlayhead: number = Date.now() - takenOffAirAt
//    return Math.max(0, timeFromPartToPlayhead - this.playheadInsetDuration)
//  }
//
//  public get onAirPartTimeOffset(): number {
//    if (!this.onAirPart) {
//      return 0
//    }
//    const timeOffsetSinceTaken = Date.now() - this.onAirPart.executedAt
//    const invertedPlayheadDuration = this.playheadInsetDuration - Math.min(this.time, this.playheadInsetDuration)
//    console.log(invertedPlayheadDuration)
//    return Math.max(0, timeOffsetSinceTaken - invertedPlayheadDuration)
//  }
//
//  public ngOnChanges(changes: SimpleChanges): void {
//    const onAirPartIndex: number = this.segment.parts.findIndex(part => part.isOnAir)
//    if (onAirPartIndex < 0) {
//      return
//    }
//    this.onAirPart = this.segment.parts[onAirPartIndex]
//    this.previousParts = this.segment.parts.slice(0, onAirPartIndex).filter(part => this.isPreviousPartVisible(part))
//    this.futureParts = this.segment.parts.slice(onAirPartIndex + 1)
//  }
//
//  private isPreviousPartVisible(part: Part): boolean {
//    if (!this.onAirPart) {
//      return false
//    }
//    const takenOffAirAt: number = part.executedAt + part.playedDuration
//    const timeFromPartToPlayhead: number = Date.now() - takenOffAirAt
//    return this.playheadInsetDuration - timeFromPartToPlayhead > 0
//  }
//
//}
//
