import { ApplicationRef, ComponentRef, createComponent, Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, TemplateRef } from '@angular/core'
import { TooltipComponent } from '../components/tooltip/tooltip.component'

const MINIMUM_HORIZONTAL_OFFSET_IN_PIXELS: number = 0

export interface TooltipMetadata {
  horizontalOffsetInPixels: number
}

@Directive({
  selector: '[sofieTooltip]',
})
export class TooltipDirective implements OnDestroy {
  @Input() public sofieTooltipTemplate: TemplateRef<unknown>

  @Output() public tooltipMetadataChange: EventEmitter<TooltipMetadata> = new EventEmitter()

  private tooltipComponentRef: ComponentRef<TooltipComponent>

  constructor(
    private readonly applicationRef: ApplicationRef,
    private readonly elementRef: ElementRef
  ) {}

  @HostListener('mouseenter', ['$event'])
  public showTooltip(event: MouseEvent): void {
    this.createTooltip()
    this.moveTooltip(event)
  }

  private createTooltip(): void {
    this.tooltipComponentRef = createComponent(TooltipComponent, {
      environmentInjector: this.applicationRef.injector,
    })

    this.tooltipComponentRef.instance.templateRef = this.sofieTooltipTemplate
    this.tooltipComponentRef.changeDetectorRef.detectChanges()

    document.body.append(this.tooltipComponentRef.location.nativeElement)
  }

  @HostListener('mousemove', ['$event'])
  public moveTooltip(event: MouseEvent): void {
    if (!this.tooltipComponentRef) {
      return
    }

    const verticalPositionInPixels: number = this.elementRef.nativeElement.getBoundingClientRect().top
    const tooltipWidthInPixels: number = this.tooltipComponentRef.instance.getWidthInPixels()

    const horizontalOffsetInPixels: number = Math.max(event.clientX - Math.ceil(tooltipWidthInPixels / 2), MINIMUM_HORIZONTAL_OFFSET_IN_PIXELS)
    const maxHorizontalOffsetInPixes: number = window.innerWidth - tooltipWidthInPixels
    const leftPositionInPixels: number = Math.min(horizontalOffsetInPixels, maxHorizontalOffsetInPixes)

    this.tooltipComponentRef.instance.topPositionInPixels = verticalPositionInPixels
    this.tooltipComponentRef.instance.leftPositionInPixels = leftPositionInPixels
    this.tooltipComponentRef.changeDetectorRef.detectChanges()

    this.tooltipMetadataChange.emit({
      horizontalOffsetInPixels: event.offsetX,
    })
  }

  @HostListener('mouseleave')
  public ngOnDestroy(): void {
    if (!this.tooltipComponentRef) {
      return
    }
    this.tooltipComponentRef.destroy()
    this.tooltipComponentRef.location.nativeElement.remove()
  }
}
