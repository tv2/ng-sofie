import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { IconButton, IconButtonSize } from '../../enums/icon-button'

export interface MultiSelectOptions {
  label: string
  id: string
  classesOnSelected?: string
  classesOnList?: string
}

@Component({
  selector: 'sofie-multi-select-old',
  templateUrl: './multi-select-component-old.component.html',
  styleUrls: ['./multi-select-component-old.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectOldComponent {
  @Input() public options: MultiSelectOptions[]
  @Input() public selectedOptionsIds: string[]
  @Input() public placeholder: string
  @Input() public showOnlyItemsCountLabel?: string

  @Output() public readonly onItemSelectionChange: EventEmitter<string[]> = new EventEmitter<string[]>()

  public readonly IconButton = IconButton
  public readonly IconButtonSize = IconButtonSize

  public getOptionById(optionId: string): MultiSelectOptions | undefined {
    return this.options.find(option => option.id === optionId)
  }

  public isOptionSelected(option: MultiSelectOptions): boolean {
    return !!this.selectedOptionsIds.find(selectedOptionId => selectedOptionId === option.id)
  }

  public onOptionClick(option: MultiSelectOptions): void {
    const selectedOptionIndex: number = this.selectedOptionsIds.findIndex(selectedOptionId => selectedOptionId === option.id)
    if (selectedOptionIndex !== -1) {
      this.unselectOption(selectedOptionIndex)
    } else {
      this.onItemSelectionChange.emit([...this.selectedOptionsIds, option.id])
    }
  }

  public unselectOption(optionIndex: number): void {
    this.selectedOptionsIds.splice(optionIndex, 1)
    this.onItemSelectionChange.emit([...this.selectedOptionsIds])
  }
}
