import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core'
import { Segment } from '../../../core/models/segment'
import { PieceLayer } from '../../../shared/enums/piece-layer'

const MINIMUM_TIMELINE_DURATION_IN_MS: number = 30_000
const RESERVED_PIXELS_ON_TIMELINE_END: number = 100

@Component({
  selector: 'sofie-full-segment-timeline',
  templateUrl: './full-segment-timeline.component.html',
  styleUrls: ['./full-segment-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullSegmentTimelineComponent implements AfterViewInit, OnChanges {
  @Input()
  public segment: Segment

  @Input()
  public pieceLayers: PieceLayer[]

  @Input()
  public time: number

  @Output()
  public setNextEvent: EventEmitter<{segmentId: string, partId: string}> = new EventEmitter()

  public pixelsPerSecond: number = 30
  private internalTimeReference: number = Date.now()

  constructor(private readonly hostElement: ElementRef) {}

  public emitSetNextEvent(partId: string): void {
    this.setNextEvent.emit({ segmentId: this.segment.id, partId})
  }

  public ngAfterViewInit() {
    this.pixelsPerSecond = this.getPixelsPerSecond()
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!this.segment.isOnAir) {
      return
    }

    if (Date.now() - this.internalTimeReference < 20) {
      return
    }

    this.internalTimeReference = Date.now()
    this.pixelsPerSecond = this.getPixelsPerSecond()
  }

  // TODO: Find a proper way of scaling and panning.
  private getPixelsPerSecond(): number {
    const duration: number = this.segment.parts.reduce((duration, part) => duration + part.getDuration(), 0)
    const displayDurationInSeconds: number = Math.max(MINIMUM_TIMELINE_DURATION_IN_MS, duration) / 1000
    const hostWidth = this.hostElement.nativeElement.offsetWidth - RESERVED_PIXELS_ON_TIMELINE_END
    return Math.floor(hostWidth / displayDurationInSeconds)
  }
}
