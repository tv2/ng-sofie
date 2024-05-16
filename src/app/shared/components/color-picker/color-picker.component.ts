import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { Icon, IconSize } from '../../enums/icon'

const DEFAULT_COLOR: string = '#FFFFFF00'

@Component({
  selector: 'sofie-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ColorPickerComponent,
    },
  ],
})
export class ColorPickerComponent implements ControlValueAccessor {
  protected readonly Icon = Icon
  protected readonly IconSize = IconSize

  protected readonly palette: string[] = [
    '#343434',
    '#005919',
    '#8d1010',
    '#c40000',
    '#ac29a5',
    '#b99000',
    '#00a99c',
    '#265753',
    '#370020',
    '#1769ff',
    '#370020',
    '#016492',
    '#003c58',
    '#00ac17',
    '#ef6c00',
  ]

  @Input() public label: string
  @Input() public placeholder?: string

  @Input() public helpText: string
  @Input() public isRequired: boolean
  @Input() public errorMessage?: string

  @Output() public valueChange: EventEmitter<string> = new EventEmitter()

  protected value?: string

  private isTouched: boolean = false

  private onChangeCallback: (value?: string) => void
  private onTouchedCallback: () => void

  constructor() {}

  protected get getColor(): string {
    return this.value ?? DEFAULT_COLOR
  }

  protected emitChanges(): void {
    this.valueChange.emit(this.value)
    this.onChangeCallback?.(this.value)
  }

  protected markAsTouched(): void {
    if (!this.onTouchedCallback || this.isTouched) {
      return
    }
    this.onTouchedCallback()
    this.isTouched = true
  }

  protected clearValue(event: Event): void {
    event.stopPropagation()
    this.value = undefined
    this.onChangeCallback?.(this.value)
  }

  public registerOnChange(onChange: (value?: string) => void): void {
    this.onChangeCallback = onChange
  }

  public registerOnTouched(onTouched: () => void): void {
    this.onTouchedCallback = onTouched
  }

  public writeValue(value: string): void {
    this.value = value
  }
}
