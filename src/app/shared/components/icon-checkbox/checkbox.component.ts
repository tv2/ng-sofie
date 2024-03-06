import { Component, EventEmitter, Input, Output } from '@angular/core'
import { IconButton, IconButtonSize } from '../../enums/icon-button'

@Component({
  selector: 'sofie-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent {
  protected readonly IconButtonSize = IconButtonSize

  @Input() public isSelected: boolean = false
  @Output() public isSelectedChange: EventEmitter<boolean> = new EventEmitter()

  @Input() public isDisabled: boolean

  @Output() private readonly onToggle: EventEmitter<boolean> = new EventEmitter()

  public toggleCheckbox(): void {
    this.isSelected = !this.isSelected
    this.isSelectedChange.emit(this.isSelected)
    this.onToggle.emit(this.isSelected)
  }

  public getIcon(): IconButton {
    return this.isSelected ? IconButton.SQUARE_CHECK : IconButton.SQUARE
  }
}
