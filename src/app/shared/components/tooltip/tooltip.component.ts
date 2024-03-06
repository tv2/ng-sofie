import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChange, SimpleChanges, ViewChild } from '@angular/core'
import { TooltipMousePosition } from 'src/app/core/models/tooltips'

@Component({
  selector: 'sofie-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent implements OnChanges, OnDestroy {
  @Input()
  public tooltipElementHoverMousePosition?: TooltipMousePosition

  @ViewChild('tooltipElementWrapper')
  protected tooltipElementWrapper: ElementRef<HTMLDivElement>

  @ViewChild('tooltipElementContent')
  protected tooltipElementContent: ElementRef<HTMLDivElement>

  private isTooltipAppended: boolean = false

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (!this.tooltipElementWrapper?.nativeElement) {
      return
    }

    const tooltipElementHoverMousePositionChange: SimpleChange | undefined = changes['tooltipElementHoverMousePosition']
    if (tooltipElementHoverMousePositionChange) {
      this.checkMouseEvent()
    }
  }

  private appendTooltipElementToBody(): void {
    document.body.append(this.tooltipElementWrapper.nativeElement)
    this.isTooltipAppended = true
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
