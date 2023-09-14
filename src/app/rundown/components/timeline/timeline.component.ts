import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild
} from '@angular/core'
import { TimestampPipe} from "../../../shared/pipes/timestamp.pipe"

interface Point {
  x: number,
  y: number
}

const TEXT_STYLE: string = '15px arial'
const TEXT_MIDDLE_POSITION: number = 13
const SUBSECTION_TOP_POSITION: number = 20

@Component({
  selector: 'sofie-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements AfterViewInit {
  @Input()
  public time: number = 0

  @Input()
  public pixelsPerSecond: number

  @ViewChild('containerElement')
  public containerElement: ElementRef

  @ViewChild('canvasElement')
  public canvasElement: ElementRef<HTMLCanvasElement>

  private canvasContext!: CanvasRenderingContext2D

  private canvasWidth: number = 0
  private canvasHeight: number = 0

  private secondsPerSection: number = 5
  private subsectionsPerSection: number = 5

  public constructor(private readonly timestampPipe: TimestampPipe) {
  }

  @HostListener('window:resize', ['$event'])
  public onResize(): void {
    this.setCanvasSize()
    this.draw()
  }

  private setCanvasSize(): void {
    this.canvasWidth = this.containerElement.nativeElement.offsetWidth
    this.canvasHeight = this.containerElement.nativeElement.offsetHeight
    this.canvasElement.nativeElement.width = this.canvasWidth
    this.canvasElement.nativeElement.height = this.canvasHeight
  }

  private draw(): void {
    this.clearCanvas()
    this.drawSubsections()
    this.drawSections()
    this.drawTimestamps()
  }

  private drawSubsections(): void {
    const subsectionWidth = this.pixelsPerSecond * this.secondsPerSection / this.subsectionsPerSection
    const subsectionCount = Math.ceil(this.canvasWidth / subsectionWidth)
    for (let i = 0; i < subsectionCount; i++) {
      this.drawSubsectionIfNotCollidingWithSection(i, subsectionWidth)
    }
  }

  private drawSubsectionIfNotCollidingWithSection(subsectionIndex: number, subsectionWidth: number): void {
    if (subsectionIndex % this.subsectionsPerSection === 0) {
      return
    }
    const from: Point = {
      x: subsectionIndex * subsectionWidth,
      y: SUBSECTION_TOP_POSITION,
    }
    const to: Point = {
      x: subsectionIndex * subsectionWidth,
      y: this.canvasHeight,
    }
    this.drawLine(from, to, 1)
  }

  private drawLine(from: Point, to: Point, lineWidth: number): void {
    this.canvasContext.lineWidth = lineWidth
    this.canvasContext.strokeStyle = '#5f6164'
    this.canvasContext.beginPath()
    this.canvasContext.moveTo(from.x, from.y)
    this.canvasContext.lineTo(to.x, to.y)
    this.canvasContext.stroke()
  }

  private drawSections(): void {
    const sectionWidth = this.pixelsPerSecond * this.secondsPerSection
    const sectionCount = Math.ceil(this.canvasWidth / sectionWidth)
    for (let i = 0; i < sectionCount; i++) {
      this.drawSection(i, sectionWidth)
    }
  }

  private drawSection(sectionIndex: number, sectionWidth: number): void {
    const from: Point = {
      x: sectionIndex * sectionWidth,
      y: 0,
    }
    const to: Point = {
      x: sectionIndex * sectionWidth,
      y: this.canvasHeight,
    }
    this.drawLine(from, to, 2)
  }

  private drawTimestamps(): void {
    const sectionWidth = this.pixelsPerSecond * this.secondsPerSection
    const sectionCount = Math.ceil(this.canvasWidth / sectionWidth)
    for (let i = 0; i < sectionCount; i++) {
      this.drawTimestamp(i, sectionWidth)
    }
  }

  private drawTimestamp(sectionIndex: number, sectionWidth: number): void {
    const x = sectionIndex * sectionWidth + 5
    const timestampInSeconds = sectionIndex * sectionWidth / this.pixelsPerSecond
    const formattedTimestamp = this.timestampPipe.transform(timestampInSeconds)
    this.drawText(formattedTimestamp, x)
  }

  private drawText(text: string, x: number): void {
      this.canvasContext.font = TEXT_STYLE;
      this.canvasContext.fillStyle = '#5f6164'
      this.canvasContext.fillText(text, x, TEXT_MIDDLE_POSITION)
  }

  private clearCanvas(): void {
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
  }

  public ngAfterViewInit(): void {
    this.initializeCanvasContext()
    this.setCanvasSize()
    this.draw()
  }

  private initializeCanvasContext(): void {
    if (!this.containerElement) {
      throw new Error('Canvas Container not loaded!')
    }

    if (!this.canvasElement) {
      throw new Error('Canvas not loaded!')
    }

    const canvasContext = this.canvasElement.nativeElement.getContext('2d');
    if (!canvasContext) {
      throw new Error('Canvas Context not loaded!')
    }
    this.canvasContext = canvasContext
  }
}
