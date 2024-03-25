import { Component, Input } from '@angular/core'

@Component({
  selector: 'sofie-text-tooltip',
  templateUrl: './text-tooltip.component.html',
  styleUrls: ['./text-tooltip.component.scss'],
})
export class TextTooltipComponent {
  @Input() public text: string
}
