import { Component, Input } from '@angular/core'
import { TooltipContentField } from '../../../../shared/abstractions/tooltip-content-field'

@Component({
  selector: 'sofie-tooltip-content',
  templateUrl: './tooltip-content.component.html',
  styleUrls: ['./tooltip-content.component.scss'],
})
export class TooltipContentComponent {
  @Input()
  public tooltipContentFields: TooltipContentField[]

  constructor() {}
}
