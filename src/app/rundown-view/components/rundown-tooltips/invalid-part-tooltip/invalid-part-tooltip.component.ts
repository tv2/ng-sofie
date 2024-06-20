import { Component, Input } from '@angular/core'
import { Icon, IconSize } from '../../../../shared/enums/icon'
import { Invalidity } from '../../../../core/models/invalidity'

@Component({
  selector: 'sofie-invalid-part-tooltip',
  templateUrl: './invalid-part-tooltip.component.html',
  styleUrls: ['./invalid-part-tooltip.component.scss'],
})
export class InvalidPartTooltipComponent {
  protected readonly Icon = Icon
  protected readonly IconSize = IconSize

  @Input() public invalidity: Invalidity
}
