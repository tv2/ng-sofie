import { Component, HostListener, Input } from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { Part } from '../../../core/models/part'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { Tv2OutputLayer } from '../../../core/models/tv2-output-layer'

const LEFT_MOUSE_BUTTON_IDENTIFIER: number = 0

@Component({
  selector: 'sofie-scrollable-timeline',
  templateUrl: './scrollable-timeline.component.html',
  styleUrls: ['./scrollable-timeline.component.scss'],
})
export class ScrollableTimelineComponent {
  @Input()
  public segment: Segment

  @Input()
  public outputLayers: Tv2OutputLayer[]

  @Input()
  public isRundownActive: boolean

  @Input()
  public pixelsPerSecond: number

  public scrollOffsetInMs: number = 0

  private horizontalDragStartPoint?: number

  constructor(private readonly partEntityService: PartEntityService) {}

  @HostListener('mousedown', ['$event'])
  public onDragStart(event: MouseEvent): void {
    if (!this.isLeftButtonEvent(event)) {
      this.horizontalDragStartPoint = undefined
      return
    }
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

  private isLeftButtonEvent(event: MouseEvent): boolean {
    return event.button === LEFT_MOUSE_BUTTON_IDENTIFIER
  }

  public onDragMove(event: MouseEvent): void {
    event.preventDefault()
    if (!this.horizontalDragStartPoint) {
      return
    }
    const newHorizontalPoint: number = event.clientX
    const horizontalDeltaInPixels: number = this.horizontalDragStartPoint - newHorizontalPoint
    this.horizontalDragStartPoint = newHorizontalPoint
    const currentEpochTime: number = Date.now()
    const segmentDurationInMs: number = this.segment.parts.reduce((duration, part) => duration + this.partEntityService.getDuration(part, currentEpochTime), 0)
    const horizontalDeltaInMs: number = (1000 * horizontalDeltaInPixels) / this.pixelsPerSecond
    const expectedDurationInMs: number = this.segment.expectedDurationInMs ?? 0
    const upperBoundInMs: number = Math.max(segmentDurationInMs, expectedDurationInMs)
    this.scrollOffsetInMs = Math.min(upperBoundInMs, Math.max(0, this.scrollOffsetInMs + horizontalDeltaInMs))
  }

  public trackPart(_: number, part: Part): string {
    return part.id
  }
}
