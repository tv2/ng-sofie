import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output, SimpleChange,
  SimpleChanges
} from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { Part } from '../../../core/models/part'
import {PieceLayerService} from "../../../shared/services/piece-layer.service";
import { PieceLayer } from '../../../shared/enums/piece-layer'
import {RundownService} from "../../../core/abstractions/rundown.service";

@Component({
  selector: 'sofie-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss']
})
export class SegmentComponent implements OnChanges, OnDestroy {
  // TODO: Remove when we have change detection for reference values.
  @Input()
  public isOnAir: boolean

  @Input()
  public segment: Segment

  public timeReference: number = 0
  public pieceLayers: PieceLayer[] = []

  private animationFrameId?: number

  constructor(
      private readonly pieceLayerService: PieceLayerService,
      private readonly rundownService: RundownService
  ) {}

  private getUsedPieceLayersInOrder(): PieceLayer[] {
    const pieceLayersInOrder: PieceLayer[] = this.pieceLayerService.getPieceLayersInOrder()
    const usedPieceLayers: Set<PieceLayer> = this.pieceLayerService.getPieceLayersForParts(this.segment.parts)
    return pieceLayersInOrder.filter(layer => usedPieceLayers.has(layer))
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.pieceLayers = this.getUsedPieceLayersInOrder()

    const isOnAirChange: SimpleChange | undefined = changes['isOnAir']
    if (isOnAirChange?.currentValue === false) {
      this.stopAnimation()
    }
    if (isOnAirChange?.previousValue !== isOnAirChange?.currentValue) {
      this.startOrStopAnimation()
    }
  }

  private startOrStopAnimation(): void {
    if (this.segment.isOnAir) {
      this.startAnimation()
      return
    }
    this.stopAnimation()
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
      console.warn(`Expected an active part in segment '${this.segment.name} (${this.segment.id})', but found none.`)
      return
    }
    const activePart: Part = this.segment.parts[activePartIndex]
    const partsUntilActivePart: Part[] = this.segment.parts.slice(0, activePartIndex)
    const timeSpendUntilActivePart: number = partsUntilActivePart.reduce((duration, part) => duration + part.getDuration(), 0)
    // TODO: Is this the right place to compute it or should it be the part that does it?
    const timeSpendInActivePart: number = activePart.executedAt > 0 ? Date.now() - activePart.executedAt : 0
    this.timeReference = timeSpendUntilActivePart + timeSpendInActivePart
  }

  public setFirstPartAsNext(): void {
    const firstPart: Part = this.segment.parts[0]
    this.rundownService.setNext(this.segment.rundownId, this.segment.id, firstPart.id).subscribe()
  }

  public ngOnDestroy() {
    this.stopAnimation()
  }
}
