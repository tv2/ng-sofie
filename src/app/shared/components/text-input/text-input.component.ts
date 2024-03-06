import { Component, Input } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

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
  @Input() public label: string
  @Input() public placeholder?: string

  public value: string

  public isDisabled: boolean
  private isTouched: boolean = false

  private onChangeCallback: (value: string) => void
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
