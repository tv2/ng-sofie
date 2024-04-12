import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { SelectOption } from '../../models/select-option'

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
  @Input() public options: SelectOption<T>[] = []

  @Input() public label: string
  @Input() public placeholder?: string

  @Input() public errorMessage?: string
  @Input() public isRequired?: boolean

  @Output() public onChange: EventEmitter<T> = new EventEmitter()

  public selectedOption: SelectOption<T>

  private onChangeCallback: (value: T) => void
  private onTouchedCallback: () => void

  private value: T

  private isTouched: boolean = false

  protected isShowingOptions: boolean = false

  constructor() {}

  public selectOption(option: SelectOption<T>): void {
    this.markAsTouched()
    this.selectedOption = option
    this.value = option.value
    this.onChange.emit(this.value)
    this.isShowingOptions = false
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
    const option: SelectOption<T> | undefined = this.options.find(option => option.value === this.value)
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

  protected toggleIsShowingOptions(): void {
    this.isShowingOptions = !this.isShowingOptions
    if (this.isShowingOptions) {
      setTimeout(() => {
        document.addEventListener('click', () => (this.isShowingOptions = false), { once: true })
      })
    }
  }
}
