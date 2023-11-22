import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core'
import { Rundown } from '../../../core/models/rundown'
import { Piece } from '../../../core/models/piece'
import { Tv2PieceMetadata } from '../../../core/models/tv2-piece'
import { Tv2PieceType } from '../../../core/enums/tv2-piece-type'
import { Part } from '../../../core/models/part'
import { Segment } from '../../../core/models/segment'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { RundownTimingContextStateService } from '../../../core/services/rundown-timing-context-state.service'
import { Subscription } from 'rxjs'
import { Logger } from '../../../core/abstractions/logger.service'
import { RundownTimingContext } from '../../../core/models/rundown-timing-context'

@Component({
  selector: 'sofie-on-air-details-panel',
  templateUrl: './on-air-details-panel.component.html',
  styleUrls: ['./on-air-details-panel.component.scss'],
})
export class OnAirDetailsPanelComponent implements OnChanges, OnInit, OnDestroy {
  @Input()
  public rundown: Rundown

  public onAirSegment?: Segment
  public onAirPart?: Part
  public endWords?: string
  public remainingDurationInMsForOnAirPart?: number
  public remainingDurationInMsForOnAirSegment?: number
  public durationInMsSpentInOnAirSegment?: number
  private rundownTimingContextSubscription?: Subscription
  private readonly logger: Logger

  constructor(
    private readonly partEntityService: PartEntityService,
    private readonly rundownTimingContextStateService: RundownTimingContextStateService,
    logger: Logger
  ) {
    this.logger = logger.tag('RundownSubheaderComponent')
  }

  public ngOnInit(): void {
    this.rundownTimingContextStateService
      .subscribeToRundownTimingContext(this.rundown.id)
      .then(rundownTimingContextObservable => rundownTimingContextObservable.subscribe(this.onRundownTimingContextChanged.bind(this)))
      .then(rundownTimingContextSubscription => (this.rundownTimingContextSubscription = rundownTimingContextSubscription))
      .catch(error => this.logger.data(error).error('Failed subscribing to rundown timing context changes.'))
  }

  private onRundownTimingContextChanged(rundownTimingContext: RundownTimingContext): void {
    this.updateOnAirPartTiming(rundownTimingContext)
    this.updateOnAirSegmentTiming(rundownTimingContext)
  }

  private updateOnAirPartTiming(rundownTimingContext: RundownTimingContext): void {
    if (!this.onAirPart || !this.doesPartContainVideoClipOrVoiceOver(this.onAirPart)) {
      this.remainingDurationInMsForOnAirPart = undefined
    } else {
      this.remainingDurationInMsForOnAirPart = rundownTimingContext.playedDurationInMsForOnAirPart - this.partEntityService.getExpectedDuration(this.onAirPart)
    }
  }

  private doesPartContainVideoClipOrVoiceOver(part: Part): boolean {
    const supportedPieceTypes: Tv2PieceType[] = [Tv2PieceType.VIDEO_CLIP, Tv2PieceType.VOICE_OVER]
    return part.pieces.some(piece => {
      const tv2PieceMetadata: Tv2PieceMetadata | undefined = piece.metadata as Tv2PieceMetadata | undefined
      const pieceType: Tv2PieceType | undefined = tv2PieceMetadata?.type
      return pieceType !== undefined && supportedPieceTypes.includes(pieceType)
    })
  }

  private updateOnAirSegmentTiming(rundownTimingContext: RundownTimingContext): void {
    if (!this.onAirSegment || this.onAirSegment.isUntimed) {
      this.remainingDurationInMsForOnAirSegment = undefined
    } else {
      const expectedDurationInMsForOnAirSegment: number = rundownTimingContext.expectedDurationsInMsForSegments[this.onAirSegment.id] ?? 0
      this.remainingDurationInMsForOnAirSegment = rundownTimingContext.playedDurationInMsForOnAirSegment - expectedDurationInMsForOnAirSegment
    }

    if (!this.onAirSegment?.executedAtEpochTime) {
      this.durationInMsSpentInOnAirSegment = undefined
    } else {
      this.durationInMsSpentInOnAirSegment = rundownTimingContext.durationInMsSpentInOnAirSegment
    }
  }

  public ngOnDestroy(): void {
    this.rundownTimingContextSubscription?.unsubscribe()
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const rundownChange: SimpleChange | undefined = changes['rundown']
    if (rundownChange) {
      this.setEndWords()
    }

    if (rundownChange && rundownChange.currentValue.segments !== rundownChange.previousValue?.segments) {
      this.onAirSegment = this.rundown.segments.find(segment => segment.isOnAir)
      this.onAirPart = this.onAirSegment?.parts.find(part => part.isOnAir)
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
}
