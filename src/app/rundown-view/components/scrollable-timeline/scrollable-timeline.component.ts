import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { PieceLayer } from '../../../shared/enums/piece-layer'
import { RundownCursor } from '../../../core/models/rundown-cursor'
import { Part } from '../../../core/models/part'
import { PartEntityService } from '../../../core/services/models/part-entity.service'

@Component({
  selector: 'sofie-scrollable-timeline',
  templateUrl: './scrollable-timeline.component.html',
  styleUrls: ['./scrollable-timeline.component.scss'],
})
export class ScrollableTimelineComponent {
  @Input()
  public segment: Segment

  @Input()
  public pieceLayers: PieceLayer[]

  @Input()
  public isRundownActive: boolean

  @Output()
  public setNextEvent: EventEmitter<RundownCursor> = new EventEmitter()

  public pixelsPerSecond: number = 50
  public scrollOffsetInMs: number = 0

  private horizontalDragStartPoint?: number

  @HostListener('mousedown', ['$event'])
  public onDragStart(event: MouseEvent): void {
    this.horizontalDragStartPoint = event.clientX
    const onDragMove: (event: MouseEvent) => void = this.onDragMove.bind(this)
    window.addEventListener('mousemove', onDragMove)
    window.addEventListener(
      'mouseup',
      () => {
        this.horizontalDragStartPoint = undefined
        window.removeEventListener('mousemove', onDragMove)
      },
      { once: true }
    )
  }

  constructor(private readonly partEntityService: PartEntityService) {}

  public onDragMove(event: MouseEvent): void {
    event.preventDefault()
    if (!this.horizontalDragStartPoint) {
      return
    }
    const newHorizontalPoint: number = event.clientX
    const horizontalDeltaInPixels: number = this.horizontalDragStartPoint - newHorizontalPoint
    this.horizontalDragStartPoint = newHorizontalPoint
    const segmentDurationInMs: number = this.segment.parts.reduce((duration, part) => duration + this.partEntityService.getDuration(part), 0)
    const horizontalDeltaInMs: number = (1000 * horizontalDeltaInPixels) / this.pixelsPerSecond
    const budgetDurationInMs: number = this.segment.budgetDuration ?? 0
    const upperBoundInMs: number = Math.max(segmentDurationInMs, budgetDurationInMs)
    this.scrollOffsetInMs = Math.min(upperBoundInMs, Math.max(0, this.scrollOffsetInMs + horizontalDeltaInMs))
  }

  public trackPart(_: number, part: Part): string {
    return part.id
  }
}
