import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChange, SimpleChanges, ViewChild } from '@angular/core'
import { TooltipMousePosition } from 'src/app/core/models/tooltips'

@Component({
  selector: 'sofie-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent implements OnChanges, OnDestroy {
  @Input() public tooltipElementHoverMousePosition?: TooltipMousePosition
  private isTooltipAppended: boolean = false

  @ViewChild('tooltipElementWrapper')
  public tooltipElementWrapper: ElementRef<HTMLDivElement>

  @ViewChild('tooltipElementContent')
  public tooltipElementContent: ElementRef<HTMLDivElement>

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const tooltipElementHoverMousePositionChange: SimpleChange | undefined = changes['tooltipElementHoverMousePosition']
    if (!tooltipElementHoverMousePositionChange || !this.tooltipElementWrapper?.nativeElement) {
      return
    }

    this.checkMouseEvent()
  }

  private appendTooltipElementToBody(): void {
    document.body.append(this.tooltipElementWrapper.nativeElement)
  }

  private removeTooltipElement(): void {
    this.tooltipElementWrapper.nativeElement.remove()
    this.isTooltipAppended = false
  }

  private checkMouseEvent(): void {
    if (!this.tooltipElementHoverMousePosition) {
      this.removeTooltipElement()
      return
    }
    if (!this.isTooltipAppended) {
      this.isTooltipAppended = true
      this.appendTooltipElementToBody()
    }
    this.calculateTooltipLocation(this.tooltipElementHoverMousePosition)
    this.changeDetectorRef.detectChanges()
  }

  private calculateTooltipLocation(mousePositon: TooltipMousePosition): void {
    const elWidth = this.tooltipElementContent.nativeElement.offsetWidth
    const elementLeftPositonInPx: number = Math.min(Math.max(mousePositon.mousePositionX - Math.ceil(elWidth / 2), 0), window.innerWidth - elWidth)
    const elementTopPositonInPx: number = mousePositon.mousePositionY - mousePositon.parrentElementOffsetY
    this.tooltipElementWrapper.nativeElement.setAttribute('style', `top: ${elementTopPositonInPx}px; left: 0px; ${elWidth === 0 && 'visibility: hidden;'}`)
    this.tooltipElementContent.nativeElement.setAttribute('style', `left: ${elWidth === 0 ? '0' : elementLeftPositonInPx}px`)
    this.tooltipElementWrapper.nativeElement.classList.remove('hidden')
  }

  public ngOnDestroy(): void {
    this.removeTooltipElement()
  }
}
