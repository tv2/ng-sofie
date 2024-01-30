import { Component, HostBinding, Input, OnChanges, OnDestroy, SimpleChange, SimpleChanges } from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { Part } from '../../../core/models/part'
import { Tv2OutputLayerService } from '../../../shared/services/tv2-output-layer.service'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { Logger } from '../../../core/abstractions/logger.service'
import { Tv2OutputLayer } from '../../../core/models/tv2-output-layer'
import { Tv2Piece } from '../../../core/models/tv2-piece'
import { Tv2PieceType } from '../../../core/enums/tv2-piece-type'
import { IconButton, IconButtonSize } from '../../../shared/enums/icon-button'

const MINIMUM_PIXELS_PER_SECOND: number = 20
const PIXELS_PER_SECOND_STEP_FACTOR: number = 1.5
const INITIAL_PIXELS_PER_SECOND: number = MINIMUM_PIXELS_PER_SECOND * Math.pow(PIXELS_PER_SECOND_STEP_FACTOR, 3)

@Component({
  selector: 'sofie-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss'],
})
export class SegmentComponent implements OnChanges, OnDestroy {
  @Input()
  public segment: Segment

  @Input()
  public isRundownActive: boolean

  @Input()
  public isAutoNextStarted: boolean

  @Input()
  public remainingDurationInMsForOnAirPart?: number

  @Input()
  public durationInMsUntilSegmentIsPutOnAir?: number

  @Input()
  public currentEpochTime: number

  public hasRemotePiece: boolean = false

  public timeReference: number = 0
  public outputLayers: Tv2OutputLayer[] = []

  public expectedDurationInMs: number = 0
  public roundedDurationInMsUntilSegmentIsPutOnAir?: number

  public pixelsPerSecond: number = INITIAL_PIXELS_PER_SECOND
  public get isAtMinimumZoomLevel(): boolean {
    return this.pixelsPerSecond <= MINIMUM_PIXELS_PER_SECOND
  }

  private animationFrameId?: number
  private readonly logger: Logger

  constructor(
    private readonly outputLayerService: Tv2OutputLayerService,
    private readonly partEntityService: PartEntityService,
    logger: Logger
  ) {
    this.logger = logger.tag('SegmentComponent')
  }

  @HostBinding('style.background-color')
  public background: string

  private getUsedOutputLayersInOrder(): Tv2OutputLayer[] {
    const outputLayersInOrder: Tv2OutputLayer[] = this.outputLayerService.getOutputLayersInOrder()
    const usedOutputLayers: Set<Tv2OutputLayer> = this.outputLayerService.getOutputLayersForParts(this.segment.parts)
    return outputLayersInOrder.filter(layer => usedOutputLayers.has(layer))
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.outputLayers = this.getUsedOutputLayersInOrder()

    if (this.isGoingOnAir()) {
      this.startAnimation()
    }
    if (this.isGoingOffAir()) {
      this.stopAnimation()
    }

    const segmentChange: SimpleChange | undefined = changes['segment']
    if (segmentChange && segmentChange.previousValue?.parts !== segmentChange.currentValue?.parts) {
      this.hasRemotePiece = this.segment.parts.some(part => this.hasPartRemotePiece(part))
      this.expectedDurationInMs =
        this.segment.expectedDurationInMs ?? this.segment.parts.reduce((sumOfExpectedDurationsInMsForParts, part) => sumOfExpectedDurationsInMsForParts + (part.expectedDuration ?? 0), 0)
    }

    if ('durationInMsUntilSegmentIsPutOnAir' in changes) {
      this.roundedDurationInMsUntilSegmentIsPutOnAir = this.durationInMsUntilSegmentIsPutOnAir !== undefined ? 1000 * Math.ceil(this.durationInMsUntilSegmentIsPutOnAir / 1000) : undefined
    }
  }

  private isGoingOnAir(): boolean {
    return this.segment.isOnAir && this.animationFrameId === undefined
  }

  private isGoingOffAir(): boolean {
    return !this.segment.isOnAir && this.animationFrameId !== undefined
  }

  private startAnimation(): void {
    if (this.animationFrameId) {
      this.stopAnimation()
    }
    this.animationFrameId = window.requestAnimationFrame(() => {
      this.updateTimeReference()
      this.startAnimation()
    })
  }

  private stopAnimation(): void {
    if (this.animationFrameId === undefined) {
      return
    }
    window.cancelAnimationFrame(this.animationFrameId)
    this.animationFrameId = undefined
  }

  private updateTimeReference(): void {
    const activePartIndex: number = this.segment.parts.findIndex(part => part.isOnAir)
    if (activePartIndex < 0) {
      this.logger.warn(`Expected an active part in segment '${this.segment.name} (${this.segment.id})', but found none.`)
      return
    }
    const activePart: Part = this.segment.parts[activePartIndex]
    const partsUntilActivePart: Part[] = this.segment.parts.slice(0, activePartIndex)
    const currentEpochTime: number = Date.now()
    const timeSpendUntilActivePart: number = partsUntilActivePart.reduce((duration, part) => duration + this.partEntityService.getDuration(part, currentEpochTime), 0)
    const timeSpendInActivePart: number = this.partEntityService.getPlayedDuration(activePart, currentEpochTime)
    this.timeReference = timeSpendUntilActivePart + timeSpendInActivePart
  }

  private hasPartRemotePiece(part: Part): boolean {
    const pieces: Tv2Piece[] = part.pieces as Tv2Piece[]
    return pieces.some(piece => piece.metadata.type === Tv2PieceType.REMOTE)
  }

  public zoomIn(): void {
    this.pixelsPerSecond = Math.max(MINIMUM_PIXELS_PER_SECOND, this.pixelsPerSecond / PIXELS_PER_SECOND_STEP_FACTOR)
  }

  public zoomOut(): void {
    this.pixelsPerSecond = this.pixelsPerSecond * PIXELS_PER_SECOND_STEP_FACTOR
  }

  public resetZoom(): void {
    this.pixelsPerSecond = INITIAL_PIXELS_PER_SECOND
  }

  public ngOnDestroy(): void {
    this.stopAnimation()
  }

  public IconButton = IconButton
  public IconButtonSize = IconButtonSize
}
