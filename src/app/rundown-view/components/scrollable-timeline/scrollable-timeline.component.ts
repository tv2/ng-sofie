import { Component, HostListener, Input } from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { Part } from '../../../core/models/part'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { Tv2OutputLayer } from '../../../core/models/tv2-output-layer'
import { PieceLifespan } from 'src/app/core/models/piece-lifespan'
import { Piece } from 'src/app/core/models/piece'

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
    if (segment.id === '64i0bTLkhG8o5qowykLbXr_KitI_') console.log('before', segment.parts[2].pieces.length)
    this.checkForSpanningElements(segment.parts)
    //this._segment = { ...segment, parts: this.checkForSpanningElements(segment.parts) }
    this._segment = segment
    if (segment.id === '64i0bTLkhG8o5qowykLbXr_KitI_') console.log('after', this._segment.parts[2].pieces.length)
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

  private checkForSpanningElements(parts: readonly Part[]): void {
    for (let index = 1; index < parts.length; index++) {
      const previousPart = parts[index - 1]
      const currentPart = parts[index]
      const prevPieceIndex = previousPart.pieces.findIndex(piece => piece.lifespan === PieceLifespan.SPANNING_UNTIL_SEGMENT_END)
      const currPieceHasSpanElement = currentPart.pieces.some(piece => piece.lifespan === PieceLifespan.SPANNING_UNTIL_SEGMENT_END)

      if (prevPieceIndex >= 0 && !currPieceHasSpanElement) {
        currentPart.pieces.push({ ...previousPart.pieces[prevPieceIndex], isSpanning: true })
      }
    }
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
