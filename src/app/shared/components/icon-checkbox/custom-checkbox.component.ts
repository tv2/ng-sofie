import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'sofie-custom-checkbox',
  templateUrl: './custom-checkbox.component.html',
  styleUrls: ['./custom-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomCheckboxComponent {
  @Input() public label: string
  @Input() public selected: boolean
  @Input() public isDisabled: boolean
  @Input() public checkboxId: string
  @Output() private readonly onChange: EventEmitter<boolean> = new EventEmitter<boolean>()

  public checkboxClick(): void {
    this.onChange.emit(!this.selected)
  }
}
