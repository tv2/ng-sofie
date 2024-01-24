import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnChanges, SimpleChange, SimpleChanges, ViewChild } from '@angular/core'
import { debounceTime, Subject } from 'rxjs'
import { TimerPipe } from '../../../shared/pipes/timer/timer.pipe'

interface Point {
  x: number
  y: number
}

const TEXT_STYLE: string = '15px arial'
const TEXT_MIDDLE_POSITION: number = 13
const SECTION_TOP_POSITION: number = 16
const SUBSECTION_TOP_POSITION: number = 22

const RESIZE_DEBOUNCE_DURATION_IN_MS: number = 10

@Component({
  selector: 'sofie-timeline-markers',
  templateUrl: './timeline-markers.component.html',
  styleUrls: ['./timeline-markers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineMarkersComponent implements AfterViewInit, OnChanges {
  @Input()
  public time: number

  @Input()
  public minimumTime: number

  @Input()
  public pixelsPerSecond: number

  @ViewChild('canvasElement')
  public canvasElement: ElementRef<HTMLCanvasElement>

  private canvasContext!: CanvasRenderingContext2D

  private canvasWidth: number = 0
  private canvasHeight: number = 0

  private readonly secondsPerSection: number = 5
  private readonly subsectionsPerSection: number = 5

  private readonly resizeSubject: Subject<void> = new Subject<void>()

  constructor(
    private readonly containerElement: ElementRef,
    private readonly timerPipe: TimerPipe
  ) {}

  @HostListener('window:resize')
  public onResize(): void {
    this.resizeSubject.next()
  }

  private setCanvasSize(): void {
    this.canvasWidth = this.containerElement.nativeElement.offsetWidth
    this.canvasHeight = this.containerElement.nativeElement.offsetHeight
    this.canvasElement.nativeElement.width = this.canvasWidth
    this.canvasElement.nativeElement.height = this.canvasHeight
  }

  private draw(): void {
    if (!this.canvasContext) {
      return
    }
    this.clearCanvas()
    this.drawSubsections()
    this.drawSections()
    this.drawTimestamps()
  }

  private drawSubsections(): void {
    const subsectionWidth: number = (this.pixelsPerSecond * this.secondsPerSection) / this.subsectionsPerSection
    const subsectionCount: number = this.subsectionsPerSection + Math.ceil(this.canvasWidth / subsectionWidth)
    const timeOffsetInPixels: number = this.pixelsPerSecond * ((this.time / 1000) % this.secondsPerSection)
    for (let i = 0; i < subsectionCount; i++) {
      this.drawSubsectionIfNotCollidingWithSection(i, subsectionWidth, timeOffsetInPixels)
    }
  }

  private drawSubsectionIfNotCollidingWithSection(subsectionIndex: number, subsectionWidth: number, timeOffsetInPixels: number): void {
    if (subsectionIndex % this.subsectionsPerSection === 0) {
      return
    }
    this.drawSubsectionFromIndex(subsectionIndex, subsectionWidth, timeOffsetInPixels)
  }

  private drawSubsectionFromIndex(subsectionIndex: number, subsectionWidth: number, timeOffsetInPixels: number): void {
    const from: Point = {
      x: subsectionIndex * subsectionWidth - timeOffsetInPixels,
      y: SUBSECTION_TOP_POSITION,
    }
    const to: Point = {
      x: subsectionIndex * subsectionWidth - timeOffsetInPixels,
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
    const sectionWidth: number = this.pixelsPerSecond * this.secondsPerSection
    const sectionCount: number = 1 + Math.ceil(this.canvasWidth / sectionWidth)
    const timeOffsetInPixels: number = this.pixelsPerSecond * ((this.time / 1000) % this.secondsPerSection)
    for (let i = 0; i < sectionCount; i++) {
      this.drawSectionFromIndex(i, sectionWidth, timeOffsetInPixels)
    }
  }

  private drawSectionFromIndex(sectionIndex: number, sectionWidth: number, timeOffsetInPixels: number): void {
    const from: Point = {
      x: sectionIndex * sectionWidth - timeOffsetInPixels,
      y: SECTION_TOP_POSITION,
    }
    const to: Point = {
      x: sectionIndex * sectionWidth - timeOffsetInPixels,
      y: this.canvasHeight,
    }
    this.drawLine(from, to, 2)
  }

  private drawTimestamps(): void {
    const sectionWidth: number = this.pixelsPerSecond * this.secondsPerSection
    const sectionCount: number = 1 + Math.ceil(this.canvasWidth / sectionWidth)
    for (let i = 0; i < sectionCount; i++) {
      this.drawTimestampFromIndex(i, sectionWidth)
    }
  }

  private drawTimestampFromIndex(sectionIndex: number, sectionWidth: number): void {
    const x: number = sectionIndex * sectionWidth - this.pixelsPerSecond * ((this.time / 1000) % this.secondsPerSection)
    const sectionTimestampInSeconds: number = this.getSectionTimestampInSeconds(sectionIndex)
    const formattedTimestamp: string = this.timerPipe.transform(sectionTimestampInSeconds * 1000, 'HH?:mm:ss')
    this.drawText(formattedTimestamp, x, TEXT_MIDDLE_POSITION)
  }

  private getSectionTimestampInSeconds(sectionIndex: number): number {
    const timeInSeconds: number = this.time / 1000
    return timeInSeconds - (timeInSeconds % this.secondsPerSection) + sectionIndex * this.secondsPerSection
  }

  private drawText(text: string, x: number, y: number): void {
    this.canvasContext.font = TEXT_STYLE
    this.canvasContext.fillStyle = '#5f6164'
    this.canvasContext.fillText(text, x, y)
  }

  private clearCanvas(): void {
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
  }

  public ngAfterViewInit(): void {
    this.resizeSubject.pipe(debounceTime(RESIZE_DEBOUNCE_DURATION_IN_MS)).subscribe(() => {
      this.setCanvasSize()
      this.draw()
    })
    this.initializeCanvasContext()
    this.setCanvasSize()
    this.draw()
    this.resizeSubject.next()
  }

  private initializeCanvasContext(): void {
    if (!this.containerElement) {
      throw new Error('Canvas Container not loaded!')
    }

    if (!this.canvasElement) {
      throw new Error('Canvas not loaded!')
    }

    const canvasContext = this.canvasElement.nativeElement.getContext('2d')
    if (!canvasContext) {
      throw new Error('Canvas Context not loaded!')
    }
    this.canvasContext = canvasContext
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const timeChange: SimpleChange | undefined = changes['time']
    if (timeChange) {
      this.draw()
      return
    }

    const pixelsPerSecondChange: SimpleChange | undefined = changes['pixelsPerSecond']
    if (pixelsPerSecondChange) {
      this.draw()
      return
    }
  }
}
