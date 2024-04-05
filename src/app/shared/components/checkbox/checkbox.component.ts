import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Icon, IconSize } from '../../enums/icon'

@Component({
  selector: 'sofie-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent {
  protected readonly IconSize = IconSize

  @Input() public isSelected: boolean = false
  @Output() public isSelectedChange: EventEmitter<boolean> = new EventEmitter()

  @Input() public isDisabled: boolean = false
  @Input() public usePartialIcon: boolean = false

  @Output() private readonly onToggle: EventEmitter<boolean> = new EventEmitter()

  public toggleCheckbox(): void {
    this.isSelected = !this.isSelected
    this.isSelectedChange.emit(this.isSelected)
    this.onToggle.emit(this.isSelected)
  }

  public getIcon(): Icon {
    if (!this.isSelected) {
      return Icon.SQUARE
    }
    return this.usePartialIcon ? Icon.SQUARE_MINUS : Icon.SQUARE_CHECK
  }
}
