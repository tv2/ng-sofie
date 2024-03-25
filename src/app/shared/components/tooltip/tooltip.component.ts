import { Component, ElementRef, HostBinding, TemplateRef } from '@angular/core'

@Component({
  selector: 'sofie-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
  @HostBinding('style.top.px')
  public topPosition: number = 0

  @HostBinding('style.left.px')
  public leftPosition: number = 0

  public templateRef: TemplateRef<unknown>

  constructor(private readonly elementRef: ElementRef) {}

  public getWidthInPixels(): number {
    return this.elementRef.nativeElement.offsetWidth
  }
}
