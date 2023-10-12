import { Component, Input, OnChanges, OnDestroy } from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { Part } from '../../../core/models/part'
import { PieceLayerService } from '../../../shared/services/piece-layer.service'
import { PieceLayer } from '../../../shared/enums/piece-layer'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { Logger } from '../../../core/abstractions/logger.service'
import { ContextMenuOption } from '../../../shared/abstractions/context-menu-option'

@Component({
  selector: 'sofie-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss'],
})
export class SegmentComponent implements OnChanges, OnDestroy {
  @Input()
  public segment: Segment

  public timeReference: number = 0
  public pieceLayers: PieceLayer[] = []

  private animationFrameId?: number
  private readonly logger: Logger

  public readonly contextMenuOptions: ContextMenuOption[] = [
    {
      label: 'Set segment as Next',
      contextAction: (): void => this.setFirstValidPartAsNext(),
    },
  ]

  constructor(
    private readonly pieceLayerService: PieceLayerService,
    private readonly rundownService: RundownService,
    private readonly partEntityService: PartEntityService,
    logger: Logger
  ) {
    this.logger = logger.tag('SegmentComponent')
  }

  private getUsedPieceLayersInOrder(): PieceLayer[] {
    const pieceLayersInOrder: PieceLayer[] = this.pieceLayerService.getPieceLayersInOrder()
    const usedPieceLayers: Set<PieceLayer> = this.pieceLayerService.getPieceLayersForParts(this.segment.parts)
    return pieceLayersInOrder.filter(layer => usedPieceLayers.has(layer))
  }

  public ngOnChanges(): void {
    this.pieceLayers = this.getUsedPieceLayersInOrder()

    if (this.isGoingOnAir()) {
      this.startAnimation()
    }
    if (this.isGoingOffAir()) {
      this.stopAnimation()
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
    const timeSpendUntilActivePart: number = partsUntilActivePart.reduce((duration, part) => duration + this.partEntityService.getDuration(part), 0)
    // TODO: Is this the right place to compute it or should it be the part that does it?
    const timeSpendInActivePart: number = activePart.executedAt > 0 ? Date.now() - activePart.executedAt : 0
    this.timeReference = timeSpendUntilActivePart + timeSpendInActivePart
  }

  public setFirstValidPartAsNext(): void {
    if (this.segment.isOnAir) {
      return
    }

    const firstValidPart: Part | undefined = this.segment.parts.find(part => part.pieces.length > 0)
    if (!firstValidPart) {
      return
    }
    this.rundownService.setNext(this.segment.rundownId, this.segment.id, firstValidPart.id).subscribe()
  }

  public ngOnDestroy(): void {
    this.stopAnimation()
  }
}
