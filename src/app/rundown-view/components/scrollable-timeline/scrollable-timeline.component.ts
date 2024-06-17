import { Component, HostListener, Input } from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { Part } from '../../../core/models/part'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { Tv2OutputLayer } from '../../../core/models/tv2-output-layer'
import { PieceLifespan } from 'src/app/core/models/piece-lifespan'

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
    const { partID, pieceID } = this.getIDPositions(segment.parts)

    if (partID >= 0) {
      this.copySpanningElement(segment.parts, partID, pieceID)
    }

    this._segment = segment
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

  private copySpanningElement(parts: readonly Part[], partID: number, pieceID: number): void {
    const pieceToCopy = parts[partID].pieces[pieceID]
    for (let i = partID + 1; i < parts.length; i++) {
      parts[i].pieces.push({ ...pieceToCopy, isSpanning: true })
    }
  }

  private getIDPositions(parts: readonly Part[]): { partID: number; pieceID: number } {
    let pieceID = -1
    return {
      partID: parts.findIndex(part => {
        pieceID = part.pieces.findIndex(piece => piece.lifespan === PieceLifespan.SPANNING_UNTIL_SEGMENT_END)
        return pieceID !== -1
      }),
      pieceID,
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

