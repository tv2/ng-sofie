import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core'
import { Observable, Subject, takeUntil } from 'rxjs'

@Component({
  selector: 'sofie-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent implements OnDestroy, AfterViewInit {
  @Input() public tooltipElementHoverMouseEventObservable: Observable<MouseEvent | undefined>

  private readonly unsubscribe$: Subject<void> = new Subject<void>()

  @ViewChild('tooltipElementWrapper')
  public tooltipElementWrapper: ElementRef<HTMLDivElement>

  @ViewChild('tooltipElementContent')
  public tooltipElementContent: ElementRef<HTMLDivElement>

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  public ngAfterViewInit(): void {
    if (!this.tooltipElementWrapper?.nativeElement) {
      return
    }
    this.appendTooltipElementToBody()
    this.tooltipElementHoverMouseEventObservable.pipe(takeUntil(this.unsubscribe$)).subscribe(event => this.checkMouseEvent(event))
  }

  private appendTooltipElementToBody(): void {
    const body: HTMLElement = document.getElementsByTagName('body')[0]
    body.append(this.tooltipElementWrapper.nativeElement)
  }

  private checkMouseEvent(event?: MouseEvent): void {
    if (event) {
      this.calculateTooltipLocation(event)
    } else {
      this.tooltipElementWrapper.nativeElement.classList.add('hidden')
    }
    this.changeDetectorRef.detectChanges()
  }

  private calculateTooltipLocation(event: MouseEvent): void {
    const elWidth = this.tooltipElementContent.nativeElement.offsetWidth
    const elementLeftPositonInPx: number = Math.min(Math.max(event.clientX - Math.ceil(elWidth / 2), 0), window.innerWidth - elWidth)
    const elementTopPositonInPx: number = event.clientY - event.offsetY
    this.tooltipElementWrapper.nativeElement.setAttribute('style', `top: ${elementTopPositonInPx}px; left: 0px; ${elWidth === 0 && 'visibility: hidden;'}`)
    this.tooltipElementContent.nativeElement.setAttribute('style', `left: ${elWidth === 0 ? '0' : elementLeftPositonInPx}px`)
    this.tooltipElementWrapper.nativeElement.classList.remove('hidden')
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe()
  }
}
