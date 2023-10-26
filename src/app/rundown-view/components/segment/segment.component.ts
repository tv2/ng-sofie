import { Component, Input, OnChanges, OnDestroy } from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { Part } from '../../../core/models/part'
import { OutputLayerService } from '../../../shared/services/output-layer.service'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { Logger } from '../../../core/abstractions/logger.service'
import { Tv2OutputLayer } from '../../../core/models/tv2-output-layer'

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

  public timeReference: number = 0
  public outputLayers: Tv2OutputLayer[] = []

  private animationFrameId?: number
  private readonly logger: Logger

  constructor(
    private readonly outputLayerService: OutputLayerService,
    private readonly partEntityService: PartEntityService,
    logger: Logger
  ) {
    this.logger = logger.tag('SegmentComponent')
  }

  private getUsedOutputLayersInOrder(): Tv2OutputLayer[] {
    const outputLayersInOrder: Tv2OutputLayer[] = this.outputLayerService.getOutputLayersInOrder()
    const usedOutputLayers: Set<Tv2OutputLayer> = this.outputLayerService.getOutputLayersForParts(this.segment.parts)
    return outputLayersInOrder.filter(layer => usedOutputLayers.has(layer))
  }

  public ngOnChanges(): void {
    this.outputLayers = this.getUsedOutputLayersInOrder()

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

  public ngOnDestroy(): void {
    this.stopAnimation()
  }
}
