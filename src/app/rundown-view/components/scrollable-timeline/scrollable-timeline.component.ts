import { Component, HostListener, Input } from '@angular/core'
import { Part } from '../../../core/models/part'
import { Piece } from '../../../core/models/piece'
import { PieceLifespan } from '../../../core/models/piece-lifespan'
import { Segment } from '../../../core/models/segment'
import { Tv2OutputLayer } from '../../../core/models/tv2-output-layer'
import { PartEntityService } from '../../../core/services/models/part-entity.service'

const LEFT_MOUSE_BUTTON_IDENTIFIER: number = 0

@Component({
  selector: 'sofie-scrollable-timeline',
  templateUrl: './scrollable-timeline.component.html',
  styleUrls: ['./scrollable-timeline.component.scss'],
})
export class ScrollableTimelineComponent {
  public get segment(): Segment {
    return this._segment
  }

  @Input() public set segment(segment: Segment) {
    this._segment = { ...segment, parts: this.augmentPartsWithSpanningPiece(segment.parts) }
  }

  private _segment: Segment

  @Input() public outputLayers: Tv2OutputLayer[]
  @Input() public isRundownActiveOrRehearsal: boolean
  @Input() public isAutoNextStarted: boolean
  @Input() public pixelsPerSecond: number

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

  private augmentPartsWithSpanningPiece(parts: readonly Part[]): Part[] {
    return parts.map((part, index, allParts) => {
      const previousPart = allParts[index - 1]
      const prevPieceWithSpanElement = previousPart?.pieces.findIndex(piece => piece.lifespan === PieceLifespan.SPANNING_UNTIL_SEGMENT_END)
      const currPieceHasSpanElement = part.pieces.some(piece => piece.lifespan === PieceLifespan.SPANNING_UNTIL_SEGMENT_END)

      if (prevPieceWithSpanElement >= 0 && !currPieceHasSpanElement) {
        part.pieces.push({ ...previousPart.pieces[prevPieceWithSpanElement], isSpanningSegment: true } as Piece)
      }
      return part
    }, [])
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
