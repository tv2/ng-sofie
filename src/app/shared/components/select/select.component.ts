import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { MultiSelectOption } from '../multi-select/multi-select.component'

@Component({
  selector: 'sofie-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SelectComponent,
    },
  ],
})
export class SelectComponent<T> implements ControlValueAccessor {
  @Input() public options: MultiSelectOption<T>[] = []

  @Input() public label: string
  @Input() public placeholder?: string

  @Output() public onChange: EventEmitter<T> = new EventEmitter()

  public selectedOption: MultiSelectOption<T>

  private onChangeCallback: (value: T) => void
  private onTouchedCallback: () => void

  private value: T

  private isTouched: boolean = false

  constructor() {}

  public selectOption(option: MultiSelectOption<T>): void {
    this.markAsTouched()
    this.selectedOption = option
    this.value = option.value
    this.onChange.emit(this.value)
    this.onChangeCallback?.(this.value)
  }

  private markAsTouched(): void {
    if (this.isTouched || !this.onTouchedCallback) {
      return
    }
    this.onTouchedCallback()
    this.isTouched = true
  }

  public writeValue(value: T): void {
    this.value = value
    this.updateSelectedOptionFromValue()
  }

  private updateSelectedOptionFromValue(): void {
    const option: MultiSelectOption<T> | undefined = this.options.find(option => option.value === this.value)
    if (!option) {
      return
    }
    this.selectedOption = option
  }

  public registerOnChange(changeCallback: (value: T) => void): void {
    this.onChangeCallback = changeCallback
  }

  public registerOnTouched(touchedCallback: () => void): void {
    this.onTouchedCallback = touchedCallback
  }
}
