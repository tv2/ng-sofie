import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChange,
  SimpleChanges
} from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { Part } from '../../../core/models/part'
import {PieceLayerService} from "../../../shared/services/piece-layer.service";

@Component({
  selector: 'sofie-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss']
})
export class SegmentComponent implements OnChanges, OnDestroy {

  @Input()
  public isRundownActive: boolean

  @Input()
  public isOnAir: boolean

  @Input()
  public segment: Segment

  @Output()
  setNextEvent: EventEmitter<{segmentId: string, partId: string}> = new EventEmitter()

  public timeReference: number = 0

  public pieceLayers: string[] = []

  private animationFrameId?: number

  constructor(private readonly pieceLayerService: PieceLayerService) {}

  public emitSetNextEvent(partId: string): void {
    this.setNextEvent.emit({ segmentId: this.segment.id, partId})
  }

  private getPieceLayers(): string[] {
    const usedPieceLayers = this.pieceLayerService.getPieceLayersForParts(this.segment.parts)
    const availablePieceLayersInOrder: string [] = [
      'OVERLAY',
      'PGM',
      'JINGLE',
      'MUSIK',
      'MANUS',
      'ADLIB',
      'SEC',
      'AUX',
    ]
    const usedPieceLayersInOrder: string[] = []

    availablePieceLayersInOrder.forEach(layer => {
      if (usedPieceLayers.includes(layer)) {
        usedPieceLayersInOrder.push(layer)
      }
    })

    return usedPieceLayersInOrder
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.pieceLayers = this.getPieceLayers()

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
    const partsUntilActivePart: Part[] = this.segment.parts.slice(0, activePartIndex + 1)
    this.timeReference = partsUntilActivePart.reduce((timeSpend, part) => timeSpend + part.getDuration(), 0)
  }

  public ngOnDestroy() {
    this.stopAnimation()
  }
}
