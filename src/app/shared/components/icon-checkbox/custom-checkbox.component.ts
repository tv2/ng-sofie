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
  @Input() public disabled: boolean
  @Input() public checkboxId: string
  @Output() private readonly checkboxChange: EventEmitter<boolean> = new EventEmitter<boolean>()

  public checkboxClick(): void {
    this.checkboxChange.emit(!this.selected)
  }
}
