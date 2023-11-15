import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core'
import { Rundown } from '../../../core/models/rundown'
import { Piece } from '../../../core/models/piece'
import { Tv2PieceMetadata } from '../../../core/models/tv2-piece'
import { Tv2PieceType } from '../../../core/enums/tv2-piece-type'
import { Part } from '../../../core/models/part'
import { Segment } from '../../../core/models/segment'
import { PartEntityService } from '../../../core/services/models/part-entity.service'

const TIME_RESOLUTION_INTERVAL: number = 100

@Component({
  selector: 'sofie-rundown-subheader',
  templateUrl: './rundown-subheader.component.html',
  styleUrls: ['./rundown-subheader.component.scss'],
})
export class RundownSubheaderComponent implements OnChanges, OnInit {
  @Input()
  public rundown: Rundown

  public onAirSegment?: Segment
  public onAirPart?: Part
  public endWords?: string
  public remainingDurationInMsForOnAirPart?: number
  public remainingDurationInMsForOnAirSegment: number = 0
  public durationInMsSpendInOnAirSegment?: number
  public timeResolutionIntervalId?: ReturnType<typeof setInterval>

  constructor(private readonly partEntityService: PartEntityService) {}

  public ngOnInit(): void {
    this.timeResolutionIntervalId = setInterval(this.onTimeResolutionUpdated.bind(this), TIME_RESOLUTION_INTERVAL)
  }

  private onTimeResolutionUpdated(): void {
    this.updateOnAirTimings()
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const rundownChange: SimpleChange = changes['rundown']
    if (rundownChange) {
      this.setEndWords()
    }

    if (rundownChange && rundownChange.currentValue.segments !== rundownChange.previousValue?.segments) {
      this.onAirSegment = this.rundown.segments.find(segment => segment.isOnAir)
      this.onAirPart = this.onAirSegment?.parts.find(part => part.isOnAir)
      this.updateOnAirTimings()
    }
  }

  private setEndWords(): void {
    this.endWords = this.rundown.segments
      .find(segment => segment.isOnAir)
      ?.parts.find(part => part.isOnAir && this.doesPartContainVideoClipPiece(part))
      ?.pieces.find(piece => this.isManusPiece(piece))?.name
  }

  private doesPartContainVideoClipPiece(part: Part): boolean {
    return part.pieces.some(piece => this.isVideoClipPiece(piece))
  }

  private isVideoClipPiece(piece: Piece): boolean {
    const pieceMetadata: Tv2PieceMetadata | undefined = piece.metadata as Tv2PieceMetadata | undefined
    return pieceMetadata?.type === Tv2PieceType.VIDEO_CLIP
  }

  private isManusPiece(piece: Piece): boolean {
    const pieceMetadata: Tv2PieceMetadata | undefined = piece.metadata as Tv2PieceMetadata | undefined
    return pieceMetadata?.type === Tv2PieceType.MANUS
  }

  private updateOnAirTimings(): void {
    const onAirPart: Part | undefined = this.onAirPart
    const onAirSegment: Segment | undefined = this.onAirSegment
    if (!onAirPart || !onAirSegment) {
      this.remainingDurationInMsForOnAirPart = undefined
      this.remainingDurationInMsForOnAirSegment = 0
      this.durationInMsSpendInOnAirSegment = undefined
      return
    }

    const onAirSegmentWasExecutedAtEpochTime: number | undefined = onAirSegment.executedAtEpochTime
    this.durationInMsSpendInOnAirSegment = onAirSegmentWasExecutedAtEpochTime ? Date.now() - onAirSegmentWasExecutedAtEpochTime : undefined

    const doesPartContainVideoClipOrVoiceOver: boolean = onAirPart.pieces.some(piece =>
      ([Tv2PieceType.VIDEO_CLIP, Tv2PieceType.VOICE_OVER] as (string | undefined)[]).includes((piece.metadata as Tv2PieceMetadata | undefined)?.type)
    )
    if (onAirPart.isUntimed || !doesPartContainVideoClipOrVoiceOver) {
      this.remainingDurationInMsForOnAirPart = undefined
    } else {
      const timeSpendInActivePart: number = this.partEntityService.getPlayedDuration(onAirPart)
      this.remainingDurationInMsForOnAirPart = timeSpendInActivePart - this.partEntityService.getExpectedDuration(onAirPart)
    }

    if (onAirSegment.isUntimed) {
      this.remainingDurationInMsForOnAirSegment = 0
    } else {
      const timeSpendInActivePart: number = this.partEntityService.getPlayedDuration(onAirPart)
      const activePartIndex = onAirSegment.parts.findIndex(part => part.id === onAirPart.id)
      const partsUntilActivePart: Part[] = onAirSegment.parts.slice(0, activePartIndex)
      const timeSpendUntilActivePart: number = partsUntilActivePart.reduce((duration, part) => duration + this.partEntityService.getDuration(part), 0)
      const segmentBudgetDurationInMs: number = onAirSegment.budgetDuration ?? onAirSegment.parts.reduce((acc, part) => this.partEntityService.getExpectedDuration(part) + acc, 0)
      const durationInMsForSegment: number = timeSpendUntilActivePart + timeSpendInActivePart
      this.remainingDurationInMsForOnAirSegment = durationInMsForSegment - segmentBudgetDurationInMs
    }
  }
}
