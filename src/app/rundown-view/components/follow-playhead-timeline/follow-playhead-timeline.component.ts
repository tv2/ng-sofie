import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core'
import { Piece } from 'src/app/core/models/piece'
import { PieceLifespan } from 'src/app/core/models/piece-lifespan'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { Tv2PieceType } from '../../../core/enums/tv2-piece-type'
import { Part } from '../../../core/models/part'
import { Segment } from '../../../core/models/segment'
import { Tv2OutputLayer } from '../../../core/models/tv2-output-layer'
import { Tv2PieceMetadata } from '../../../core/models/tv2-piece'
import { PartEntityService } from '../../../core/services/models/part-entity.service'

const PRE_PLAYHEAD_INSET_IN_PIXELS: number = 40
const POST_PLAYHEAD_INSET_IN_PIXELS: number = 200

@Component({
  selector: 'sofie-follow-playhead-timeline',
  templateUrl: './follow-playhead-timeline.component.html',
  styleUrls: ['./follow-playhead-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowPlayheadTimelineComponent implements OnChanges {
  public get segment(): Segment {
    return this._segment
  }

  @Input() public set segment(segment: Segment) {
    this._segment = { ...segment, parts: this.checkForSpanningElements(segment.parts) }
  }

  private _segment: Segment

  @Input()
  public time: number

  @Input()
  public outputLayers: Tv2OutputLayer[]

  @Input()
  public isRundownActiveOrRehearsal: boolean

  @Input()
  public isAutoNextStarted: boolean

  @Input()
  public pixelsPerSecond: number

  @Input()
  public remainingDurationInMsForOnAirPart?: number

  public onAirPart?: Part
  public previousParts: Part[] = []
  public futureParts: Part[] = []

  public shouldShowPartCountdown: boolean = false

  public get prePlayheadDurationInMs(): number {
    return (PRE_PLAYHEAD_INSET_IN_PIXELS * 1000) / this.pixelsPerSecond
  }

  public get postPlayheadDurationInMs(): number {
    return (POST_PLAYHEAD_INSET_IN_PIXELS * 1000) / this.pixelsPerSecond
  }

  constructor(
    private readonly partEntityService: PartEntityService,
    private readonly rundownService: RundownService
  ) {}

  public setPartAsNext(part: Part): void {
    this.rundownService.setNext(this.segment.rundownId, part.segmentId, part.id).subscribe()
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const onAirPartIndex: number = this.segment.parts.findIndex(part => part.isOnAir)
    if (onAirPartIndex < 0) {
      return
    }
    this.onAirPart = this.segment.parts[onAirPartIndex]
    this.previousParts = this.getPreviousParts(onAirPartIndex)
    this.futureParts = this.getFutureParts(onAirPartIndex)

    const segmentChange: SimpleChange | undefined = changes['segment']
    if (segmentChange) {
      const segment: Segment = segmentChange.currentValue
      this.shouldShowPartCountdown = segment.parts.some(part => this.doesPartContainVideoClipOrVoiceOver(part))
    }
  }

  private checkForSpanningElements(parts: readonly Part[]): Part[] {
    return parts.reduce((result: Part[], currentPart: Part, index: number) => {
      const previousPart = result[index - 1]
      const prevPieceWithSpanElement = previousPart?.pieces.findIndex(piece => piece.lifespan === PieceLifespan.SPANNING_UNTIL_SEGMENT_END)
      const currPieceHasSpanElement = currentPart.pieces.some(piece => piece.lifespan === PieceLifespan.SPANNING_UNTIL_SEGMENT_END)

      if (prevPieceWithSpanElement >= 0 && !currPieceHasSpanElement) {
        console.log('curr', currentPart)
        currentPart.pieces.push({ ...previousPart.pieces[prevPieceWithSpanElement], isSpanned: true } as Piece)
      }
      return [...result, currentPart]
    }, [])
  }

  private getPreviousParts(onAirPartIndex: number): Part[] {
    const currentEpochTime: number = Date.now()
    const previousParts: Part[] = this.segment.parts.slice(0, onAirPartIndex).filter(part => this.getDisplayDurationInMs(part, currentEpochTime) > 0)

    // TODO: Take into account more than the closest previous part and not only if none was found in the first step.
    // In order to jump in from anywhere and display the correct transition this is needed.
    const partBeforeOnAirPart: Part | undefined = this.segment.parts[onAirPartIndex - 1]
    if (previousParts.length === 0 && partBeforeOnAirPart && this.isUnplayedPart(partBeforeOnAirPart)) {
      return [partBeforeOnAirPart]
    }
    return previousParts
  }

  private getDisplayDurationInMs(part: Part, currentEpochTime: number): number {
    const takenOffAirAt: number = part.executedAt + part.playedDuration
    const durationInMsSinceTakenOfAir = currentEpochTime - takenOffAirAt
    return this.prePlayheadDurationInMs - durationInMsSinceTakenOfAir
  }

  private isUnplayedPart(part: Part): boolean {
    return part.playedDuration === 0 && part.executedAt === 0
  }

  private getFutureParts(onAirPartIndex: number): Part[] {
    return this.segment.parts.slice(onAirPartIndex + 1)
  }

  public getOnAirPartOffsetInMs(): number {
    if (!this.onAirPart) {
      return 0
    }
    const playedDurationInMsForPart: number = Date.now() - this.onAirPart.executedAt
    return playedDurationInMsForPart - this.prePlayheadDurationInMs
  }

  public getPreviousPartOffsetInMs(part: Part): number {
    const currentEpochTime: number = Date.now()
    if (this.isUnplayedPart(part)) {
      return this.getUnplayedPreviousPartOffsetInMs(part)
    }
    if (!this.isFirstPartInPreviousParts(part)) {
      return 0
    }

    const displayDurationInMs: number = this.getDisplayDurationInMs(part, currentEpochTime)
    return Math.max(0, part.playedDuration - displayDurationInMs)
  }

  private getUnplayedPreviousPartOffsetInMs(part: Part): number {
    if (!this.onAirPart) {
      return 0
    }
    const currentEpochTime: number = Date.now()
    const expectedPartDuration: number = this.partEntityService.getDuration(part, currentEpochTime)
    const playedDurationInOnAirPart: number = Date.now() - this.onAirPart.executedAt
    return expectedPartDuration - (this.prePlayheadDurationInMs - playedDurationInOnAirPart)
  }

  private isFirstPartInPreviousParts(part: Part): boolean {
    return this.previousParts[0]?.id === part.id
  }

  private doesPartContainVideoClipOrVoiceOver(part: Part): boolean {
    const supportedPieceTypes: (string | undefined)[] = [Tv2PieceType.VIDEO_CLIP, Tv2PieceType.VOICE_OVER]
    return part.pieces.some(piece => supportedPieceTypes.includes((piece.metadata as Tv2PieceMetadata | undefined)?.type)) ?? false
  }

  public trackPart(_: number, part: Part): string {
    return part.id
  }
}
