import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
  selector: 'sofie-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() public isDisabled: boolean = false
  @Input() public tooltip?: string
  @Input() public type: 'STANDARD' | 'PRIMARY' | 'WARNING' | 'DANGER' = 'STANDARD'
}
