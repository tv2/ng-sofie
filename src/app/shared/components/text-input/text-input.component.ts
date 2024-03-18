import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { Icon, IconSize } from '../../enums/icon'

@Component({
  selector: 'sofie-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['text-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: TextInputComponent,
    },
  ],
})
export class TextInputComponent implements ControlValueAccessor {
  protected readonly Icon = Icon
  protected readonly IconSize = IconSize

  @Input() public label: string
  @Input() public placeholder?: string

  @Input() public helpText: string

  @Input() public value: string
  @Output() public valueChange: EventEmitter<string> = new EventEmitter()

  public isDisabled: boolean
  private isTouched: boolean = false

  private onChangeCallback: (value: string) => void
  private onTouchedCallback: () => void

  constructor() {}

  public onChange(value: string): void {
    this.value = value
    this.markAsTouched()
    this.valueChange.emit(this.value)
    if (this.onChangeCallback) {
      this.onChangeCallback(this.value)
    }
  }

  private markAsTouched(): void {
    if (!this.onTouchedCallback || this.isTouched) {
      return
    }
    this.onTouchedCallback()
    this.isTouched = true
  }

  public writeValue(value: string): void {
    this.value = value
  }

  public registerOnChange(onChange: (value: string) => void): void {
    this.onChangeCallback = onChange
  }

  public registerOnTouched(onTouched: () => void): void {
    this.onTouchedCallback = onTouched
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled
  }
}
