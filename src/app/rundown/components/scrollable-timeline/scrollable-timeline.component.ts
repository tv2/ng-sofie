import {
  Component,
  EventEmitter, HostBinding, HostListener,
  Input,
  Output,
} from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { PieceLayer } from '../../../shared/enums/piece-layer'
import { RundownCursor } from '../../../core/models/rundown-cursor'
import { Part } from '../../../core/models/part'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { RundownService } from '../../../core/abstractions/rundown.service'

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

  @Output()
  public setNextEvent: EventEmitter<RundownCursor> = new EventEmitter()

  public pixelsPerSecond: number = 50
  public scrollOffsetInMs: number = 0

  public horizontalDragStartPoint?: number

  @HostListener('mousedown', ['$event'])
  public onDragStart(event: DragEvent): void {
    this.horizontalDragStartPoint = event.clientX
    const onDragMove: (event: MouseEvent) => void = this.onDragMove.bind(this)
    window.addEventListener('mousemove', onDragMove)
    window.addEventListener('mouseup', () => {
      this.horizontalDragStartPoint = undefined
      window.removeEventListener('mousemove', onDragMove)
    }, { once: true })
  }

  public constructor(
      private readonly partEntityService: PartEntityService,
      private readonly rundownService: RundownService
  ) {}

  public setPartAsNext(part: Part): void {
    this.rundownService.setNext(this.segment.rundownId, this.segment.id, part.id).subscribe()
  }

  public onDragMove(event: MouseEvent): void {
    event.preventDefault()
    if (!this.horizontalDragStartPoint) {
        return
    }
    const newHorizontalPoint: number = event.clientX
    const horizontalDelta: number = this.horizontalDragStartPoint - newHorizontalPoint
    this.horizontalDragStartPoint = newHorizontalPoint
    const segmentDurationInMs: number = this.segment.parts.reduce((duration, part) => duration + this.partEntityService.getDuration(part), 0)
    this.scrollOffsetInMs = Math.min(
        segmentDurationInMs,
        Math.max(0, this.scrollOffsetInMs + 1000 * horizontalDelta / this.pixelsPerSecond)
    )
  }

  public trackPart(_: number, part: Part): string {
    return part.id
  }
}
