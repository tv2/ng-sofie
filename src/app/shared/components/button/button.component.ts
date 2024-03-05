import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
  selector: 'sofie-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() public disabled: boolean = false
  @Input() public type: 'PRIMARY' | 'WARNING' | 'DANGER' = 'PRIMARY'

  constructor() {}

  get getBackgroundColor(): string {
    switch (this.type) {
      case 'WARNING': {
        return 'var(--yellow-color)'
      }
      case 'DANGER': {
        return 'var(--danger-color)'
      }
      case 'PRIMARY':
      default: {
        return 'var(--white-color)'
      }
    }
  }

  get gettextColor(): string {
    switch (this.type) {
      case 'WARNING': {
        return 'var(--white-color)'
      }
      case 'DANGER': {
        return 'var(--white-color)'
      }
      case 'PRIMARY':
      default: {
        return 'var(--black-color)'
      }
    }
  }
}
