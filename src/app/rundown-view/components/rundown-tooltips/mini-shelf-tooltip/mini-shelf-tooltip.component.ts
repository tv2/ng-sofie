import { ChangeDetectorRef, Component, HostListener, Input } from '@angular/core'
import { TooltipMousePosition } from 'src/app/core/models/tooltips'

@Component({
  selector: 'sofie-mini-shelf-tooltip',
  templateUrl: './mini-shelf-tooltip.component.html',
  styleUrls: ['./mini-shelf-tooltip.component.scss'],
})
export class MiniShelfTooltipComponent {
  @Input() public filename: string
  @Input() public durationInMs: number
  public tooltipElementHoverMousePosition?: TooltipMousePosition

  private readonly timeoutDurationAfterMouseMoveInMs = 5
  private timeoutAfterMouseMove?: NodeJS.Timeout

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  @HostListener('mouseenter', ['$event'])
  @HostListener('mousemove', ['$event'])
  @HostListener('mouseleave', [])
  public emitNewHoverMouseEvent(event?: MouseEvent): void {
    if (this.timeoutAfterMouseMove) {
      clearTimeout(this.timeoutAfterMouseMove)
    }
    this.timeoutAfterMouseMove = setTimeout(() => {
      this.tooltipElementHoverMousePosition = event
        ? {
            mousePositionX: event.clientX,
            mousePositionY: event.clientY,
            parrentElementOffsetY: event.offsetY,
            parrentElementOffsetX: event.offsetX,
          }
        : undefined
      this.changeDetectorRef.detectChanges()
    }, this.timeoutDurationAfterMouseMoveInMs)
  }
}
