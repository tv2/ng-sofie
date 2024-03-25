import { ApplicationRef, ComponentRef, createComponent, Directive, EventEmitter, HostListener, Input, OnDestroy, Output, TemplateRef } from '@angular/core'
import { TooltipComponent } from '../components/tooltip/tooltip.component'

export interface TooltipMetadata {
  horizontalOffsetInPixels: number
  hostElementWidth?: number
}

@Directive({
  selector: '[sofieTooltip]',
})
export class TooltipDirective implements OnDestroy {
  @Input() public sofieTooltip: TemplateRef<unknown>

  @Output() public tooltipMetadata: EventEmitter<TooltipMetadata> = new EventEmitter()

  private tooltipComponentRef: ComponentRef<TooltipComponent>

  constructor(private readonly applicationRef: ApplicationRef) {}

  @HostListener('mouseenter', ['$event'])
  public showTooltip(event: MouseEvent): void {
    this.createTooltip()
    this.moveTooltip(event)
  }

  private createTooltip(): void {
    this.tooltipComponentRef = createComponent(TooltipComponent, {
      environmentInjector: this.applicationRef.injector,
    })

    this.tooltipComponentRef.instance.templateRef = this.sofieTooltip
    this.tooltipComponentRef.changeDetectorRef.detectChanges()

    document.body.append(this.tooltipComponentRef.location.nativeElement)
  }

  @HostListener('mousemove', ['$event'])
  public moveTooltip(event: MouseEvent): void {
    if (!this.tooltipComponentRef) {
      return
    }

    const top: number = event.clientY - event.offsetY
    const tooltipWidth = this.tooltipComponentRef.instance.tooltipContainer.nativeElement.offsetWidth
    const left: number = Math.min(Math.max(event.clientX - Math.ceil(tooltipWidth / 2), 0), window.innerWidth - tooltipWidth)
    this.tooltipComponentRef.instance.updatePosition(top, left)

    this.tooltipMetadata.emit({
      horizontalOffsetInPixels: event.offsetX,
    })
  }

  @HostListener('mouseleave', [])
  public ngOnDestroy(): void {
    if (!this.tooltipComponentRef) {
      return
    }
    this.tooltipComponentRef.destroy()
    this.tooltipComponentRef.location.nativeElement.remove()
  }
}
