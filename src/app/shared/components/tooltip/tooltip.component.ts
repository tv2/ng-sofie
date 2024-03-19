import { ChangeDetectorRef, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core'

@Component({
  selector: 'sofie-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
  public topPosition: string = '0px'
  public leftPosition: string = '0px'

  public templateRef: TemplateRef<unknown>

  @ViewChild('tooltipContainer') public tooltipContainer: ElementRef

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  public updatePosition(top: number, left: number): void {
    this.topPosition = top + 'px'
    this.leftPosition = left + 'px'
    this.changeDetectorRef.detectChanges()
  }
}
