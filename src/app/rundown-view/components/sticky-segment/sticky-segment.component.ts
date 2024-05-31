import { AfterViewInit, Component, ElementRef, Input, OnDestroy } from '@angular/core'
import { Segment } from '../../../core/models/segment'

@Component({
  selector: 'sofie-sticky-segment',
  templateUrl: './sticky-segment.component.html',
  styleUrls: ['./sticky-segment.component.scss'],
})
export class StickySegmentComponent implements AfterViewInit, OnDestroy {
  @Input()
  public segment: Segment

  @Input()
  public isRundownActiveOrRehearsal: boolean

  @Input()
  public isAutoNextStarted: boolean

  @Input()
  public remainingDurationInMsForOnAirPart?: number

  @Input()
  public durationInMsUntilSegmentIsPutOnAir?: number

  @Input()
  public currentEpochTime: number

  private readonly intersectionObserver: IntersectionObserver

  constructor(
    private readonly hostElement: ElementRef,
  ) {
    this.intersectionObserver = this.createViewportIntersectionObserver()
  }

  private createViewportIntersectionObserver(): IntersectionObserver {
    return new IntersectionObserver(
      ([event]): void => {
        event.target.classList.toggle('stuck', event.intersectionRatio < 1)
      },
      { threshold: [1] }
    )
  }

  public ngAfterViewInit(): void {
    this.intersectionObserver.observe(this.hostElement.nativeElement)
  }

  public ngOnDestroy(): void {
    this.intersectionObserver.disconnect()
  }
}
