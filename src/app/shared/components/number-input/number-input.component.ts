import { Component, Input } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { IconButton, IconButtonSize } from '../../enums/icon-button'

@Component({
  selector: 'sofie-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['number-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: NumberInputComponent,
    },
  ],
})
export class NumberInputComponent implements ControlValueAccessor {
  protected readonly IconButton = IconButton
  protected readonly IconButtonSize = IconButtonSize

  @Input() public label: string
  @Input() public placeholder?: string

  @Input() public helpText: string

  public value: number

  public isDisabled: boolean
  private isTouched: boolean = false

  private onChangeCallback: (value: number) => void
  private onTouchedCallback: () => void

  constructor() {}

  public onChange(): void {
    this.markAsTouched()
    this.onChangeCallback(this.value)
  }

  private markAsTouched(): void {
    if (this.isTouched) {
      return
    }
    this.onTouchedCallback()
    this.isTouched = true
  }

  public writeValue(value: number): void {
    this.value = value
  }

  public registerOnChange(onChange: (value: number) => void): void {
    this.onChangeCallback = onChange
  }

  public registerOnTouched(onTouched: () => void): void {
    this.onTouchedCallback = onTouched
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled
  }
}
