import { Component, Input, OnInit } from '@angular/core'
import { IconButton, IconButtonSize } from '../../enums/icon-button'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

export interface MultiSelectOption<T> {
  name: string
  value: T
}

interface SelectableOption<T> extends MultiSelectOption<T> {
  isSelected: boolean
}

@Component({
  selector: 'sofie-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: MultiSelectComponent,
    },
  ],
})
export class MultiSelectComponent<T> implements OnInit, ControlValueAccessor {
  protected IconButton = IconButton
  protected IconButtonSize = IconButtonSize

  @Input() public options: MultiSelectOption<T>[] = []
  public selectableOptions: SelectableOption<T>[] = []

  @Input() public label: string
  @Input() public placeholder?: string

  public selectedOptions: SelectableOption<T>[] = []

  private onChangeCallback: (value: T[]) => void
  private onTouchedCallback: () => void

  private values: T[] = []

  private isTouched: boolean = false

  constructor() {}

  public ngOnInit(): void {
    this.selectableOptions = this.options.map(option => {
      return {
        ...option,
        isSelected: false,
      }
    })
  }

  public toggleOption(option: SelectableOption<T>): void {
    this.markAsTouched()
    option.isSelected = !option.isSelected
    if (option.isSelected) {
      this.selectedOptions.push(option)
      this.updateValuesFromSelectedOptions()
      return
    }
    const index: number = this.selectedOptions.indexOf(option)
    if (index < 0) {
      return
    }
    this.selectedOptions.splice(index, 1)

    this.updateValuesFromSelectedOptions()
  }

  private markAsTouched(): void {
    if (this.isTouched || !this.onTouchedCallback) {
      return
    }
    this.onTouchedCallback()
    this.isTouched = true
  }

  private updateValuesFromSelectedOptions(): void {
    this.values = this.selectedOptions.map(option => option.value)
    if (!this.onChangeCallback) {
      return
    }
    this.onChangeCallback(this.values)
  }

  public getSelectedOptionsAsDisplay(): string {
    return this.selectedOptions
      .map(option => option.name)
      .reduce((a, b) => {
        return `${a}, ${b}`
      })
  }

  public clearAllSelected(): void {
    this.clearSelectedOptions()
    this.updateValuesFromSelectedOptions()
  }

  private clearSelectedOptions(): void {
    this.selectableOptions.map(option => (option.isSelected = false))
    this.selectedOptions = []
  }

  public writeValue(value: T[]): void {
    this.values = value
    this.updateSelectedOptionsFromValues()
  }

  private updateSelectedOptionsFromValues(): void {
    this.clearSelectedOptions()
    this.values.forEach(value => {
      const option: SelectableOption<T> | undefined = this.selectableOptions.find(option => option.value === value)
      if (!option) {
        return
      }
      option.isSelected = true
      this.selectedOptions.push(option)
    })
  }

  public registerOnChange(changeCallback: (value: T[]) => void): void {
    this.onChangeCallback = changeCallback
  }

  public registerOnTouched(touchCallback: () => void): void {
    this.onTouchedCallback = touchCallback
  }
}
