import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { Part } from '../../../core/models/part'
import {PieceLayerService} from "../../../shared/services/piece-layer.service";

@Component({
  selector: 'sofie-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss']
})
export class SegmentComponent implements OnChanges {

  @Input()
  public isRundownActive: boolean

  @Input()
  public isOnAir: boolean

  @Input()
  public segment: Segment

  @Output()
  setNextEvent: EventEmitter<{segmentId: string, partId: string}> = new EventEmitter()

  @Output()
  public timeReference: number = 0

  public pieceLayers: string[] = []

  private animationFrameId?: number

  constructor(private readonly pieceLayerService: PieceLayerService) {}

  public emitSetNextEvent(partId: string): void {
    this.setNextEvent.emit({ segmentId: this.segment.id, partId})
  }

  private getPieceLayers(): string[] {
    //Make this list compare to the retrieved actual layers
    // return [
    //   'OVERLAY',
    //   'PGM',
    //   'JINGLE',
    //   'MUSIK',
    //   'MANUS',
    //   'ADLIB',
    //   'SEC',
    //   'AUX',
    // ]
    return this.pieceLayerService.getPieceLayersForParts(this.segment.parts)
  }

  public ngOnChanges(changes: SimpleChanges): void {
    console.error('CHANGED')
    this.pieceLayers = this.getPieceLayers()

    const segmentChange: SimpleChange | undefined = changes['segment']
    if (segmentChange && this.didSegmentOnAirStatusChange(segmentChange)) {
      this.startOrStopAnimation()
    }
  }

  private didSegmentOnAirStatusChange(segmentChange: SimpleChange): boolean {
    return segmentChange.currentValue.isOnAir !== segmentChange.previousValue?.isOnAir
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
    if (!this.animationFrameId) {
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
    const timeSpendUntilActivePart: number = partsUntilActivePart.reduce((duration, part) => duration + ((part as any).playedDuration ?? part.expectedDuration ?? 4000), 0)
    const timeSpendInActivePart: number = activePart.executedAt > 0 ? Date.now() - activePart.executedAt : 0
    this.timeReference = timeSpendUntilActivePart + timeSpendInActivePart
  }
}
