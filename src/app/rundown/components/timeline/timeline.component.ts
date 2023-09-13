import {
  AfterViewInit,
  Component,
  ElementRef, EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { TimestampPipe} from "../../../shared/pipes/timestamp.pipe"
import {Part} from "../../../core/models/part";
import {Segment} from "../../../core/models/segment";

interface Point {
  x: number,
  y: number
}

const Y_BOTTOM_COORDINATE: number = 25
const Y_LONG_LINE_TOP_COORDINATE: number = 40
const Y_SHORT_LINE_TOP_COORDINATE: number = 33
const TEXT_FONT: string = '14px arial'
const Y_TEXT_COORDINATE: number = 16

@Component({
  selector: 'sofie-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})

export class TimelineComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input()
  public segment: Segment

  @Input()
  public pixelsPerSecond: number

  @ViewChild('canvasContainer')
  public canvasContainer!: ElementRef

  @ViewChild('timeline')
  public timeline!: ElementRef<HTMLCanvasElement>

  public context!: CanvasRenderingContext2D

  public SECONDS_PER_SECTION: number = 5
  public SUBSECTIONS_PER_SECTION: number = 5

  private CANVAS_WIDTH: number = 0

  private animationFrameIdentifier: any = undefined

  constructor(private timestampPipe: TimestampPipe) {}

  ngOnInit(): void {
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.setCanvasSize()
    this.draw(0)
  }

  private setCanvasSize(): void {
    this.CANVAS_WIDTH = this.canvasContainer.nativeElement.offsetWidth
    this.timeline.nativeElement.width = this.CANVAS_WIDTH
    this.timeline.nativeElement.height = 30
  }

  public ngAfterViewInit(): void {
    this.initializeCanvas()
    this.setCanvasSize()
    this.startAnimation()
  }

  private initializeCanvas(): void {
    if (!this.canvasContainer) {
      throw new Error('Canvas Container not loaded!')
    }

    if (!this.timeline) {
      throw new Error('Canvas not loaded!')
    }

    const context = this.timeline.nativeElement.getContext('2d');
    if (!context) {
      throw new Error('Canvas Context not loaded!')
    }
    this.context = context
  }
  public startAnimation(): void {
    if (!this.animationFrameIdentifier) {
      this.clearCanvas()
      this.draw(0)
      this.animationFrameIdentifier = requestAnimationFrame(time => this.animationFrameCallback(time))
    }
  }

  public stopAnimation(): void {
    if (this.animationFrameIdentifier) {
      cancelAnimationFrame(this.animationFrameIdentifier)
      this.animationFrameIdentifier = undefined
    }
  }

  private animationFrameCallback(timestamp: number): void {
    if (this.segment.isOnAir) {
      this.redraw()
    }
    this.animationFrameIdentifier = requestAnimationFrame(time => this.animationFrameCallback(time))
  }

  private redraw(): void {
    const activePartIndex: number = this.segment.parts.findIndex(part => part.isOnAir)
    if (activePartIndex < 0) {
      console.warn('No active part in timeline')
      return
    }
    const partsUntilOnAirPart: Part[] = this.segment.parts.slice(0, activePartIndex)
    const offsetDuration: number = partsUntilOnAirPart.reduce((duration, part) => duration + (part.expectedDuration ?? 0), 0)

    const activePart: Part = this.segment.parts[activePartIndex]
    // TODO: How do we handle if the executedAt is 0 (not set)
    const durationInActivePart = Date.now() - activePart.executedAt

    const duration = offsetDuration + durationInActivePart
    this.clearCanvas()
    this.draw(duration)
  }

  public ngOnDestroy() {
    this.stopAnimation()
  }

  private clearCanvas(): void {
    this.context.clearRect(0, 0, this.timeline.nativeElement.width, this.timeline.nativeElement.height)
  }

  private draw(timestampInMilliseconds: number): void {
    const sectionsInCanvas = Math.ceil(this.CANVAS_WIDTH / (this.pixelsPerSecond * this.SECONDS_PER_SECTION))

    const pixelsPrSection: number = this.CANVAS_WIDTH / sectionsInCanvas
    const millisecondsPrSection: number = this.SECONDS_PER_SECTION * 1000;
    const pixelsPrMillisecond: number = pixelsPrSection / millisecondsPrSection
    const timestampWithinSection: number = timestampInMilliseconds % millisecondsPrSection;

    for (let i: number = 0; i <= sectionsInCanvas; i++) {
      // Multiply with negative one to make the animation go from right to left.
      const x: number = (timestampWithinSection * -1) * pixelsPrMillisecond + (i * pixelsPrSection);
      const from: Point = {
        x,
        y: Y_BOTTOM_COORDINATE
      }
      this.drawLongVerticalLine(from)
      this.drawTimestamp(timestampInMilliseconds, i, x)

      const pixelsPrSubSection: number = pixelsPrSection / this.SUBSECTIONS_PER_SECTION
      for (let j: number = 1; j < this.SUBSECTIONS_PER_SECTION; j++) {
        from.x = x + (pixelsPrSubSection * j)
        this.drawShortVerticalLine(from)
      }
    }
    this.drawBottomLine()
  }

  private drawTimestamp(timestampSinceStartMilliseconds: number, index: number, xCoordinate: number): void {
    let secondsSinceStart: number = Math.floor(timestampSinceStartMilliseconds / 1000)
    const isInNumberTable: boolean = secondsSinceStart % this.SECONDS_PER_SECTION === 0;
    if (!isInNumberTable) {
      // The 'seconds since start' is not in the number table of the current 'seconds pr section' so we need to find the closest number in the table that already has been shown.
      // E.g. 11 is not in the number table of 3, so we need to display 9. 7 is not in the number table of 2, so we need to display 6.
      secondsSinceStart -= secondsSinceStart % this.SECONDS_PER_SECTION
    }
    const secondsToDisplay: number = secondsSinceStart + (index * this.SECONDS_PER_SECTION);
    this.drawText(this.timestampPipe.transform(secondsToDisplay), xCoordinate)
  }

  private drawLongVerticalLine(from: Point): void {
    const to: Point = {
      x: from.x,
      y: Y_LONG_LINE_TOP_COORDINATE
    }
    this.drawStraightLine(from, to)
  }

  private drawShortVerticalLine(from: Point): void {
    const toUp: Point = {
      x: from.x,
      y: Y_SHORT_LINE_TOP_COORDINATE
    }
    this.drawStraightLine(from, toUp)
  }

  private drawBottomLine(): void {
    const from: Point = {
      x: 0,
      y: Y_BOTTOM_COORDINATE
    };
    const to: Point = {
      x: this.CANVAS_WIDTH,
      y: Y_BOTTOM_COORDINATE
    };
    this.drawStraightLine(from, to)
  }

  private drawStraightLine(from: Point, to: Point): void {
    this.context.beginPath()
    this.context.moveTo(from.x, from.y)
    this.context.lineTo(to.x, to.y)
    this.context.stroke()
    this.context.strokeStyle = '#5f6164'
  }

  private drawText(text: string, x: number): void {
    this.context.font = TEXT_FONT;
    this.context.fillStyle = '#5f6164'
    this.context.fillText(text, x, Y_TEXT_COORDINATE)
  }
}
