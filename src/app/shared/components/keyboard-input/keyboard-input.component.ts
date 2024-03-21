import { Component, Input } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { Keys } from '../../../keyboard/value-objects/key-binding'
import { KeyAlias } from '../../../keyboard/value-objects/key-alias'
import { Icon, IconSize } from '../../enums/icon'

const SHORTCUT_KEYS_MAPPINGS: Record<string, string> = {
  Enter: KeyAlias.ANY_ENTER,
  NumpadEnter: KeyAlias.ANY_ENTER,
  ShiftLeft: KeyAlias.SHIFT,
  ShiftRight: KeyAlias.SHIFT,
  ControlLeft: KeyAlias.CONTROL,
  ControlRight: KeyAlias.CONTROL,
}

@Component({
  selector: 'sofie-keyboard-input',
  templateUrl: './keyboard-input.component.html',
  styleUrls: ['./keyboard-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: KeyboardInputComponent,
    },
  ],
})
export class KeyboardInputComponent implements ControlValueAccessor {
  protected readonly Icon = Icon
  protected readonly IconSize = IconSize

  @Input() public label: string
  @Input() public placeholder?: string

  @Input() public helpText: string

  private isFirstKeyAfterFocus: boolean

  private onChangeCallback: (value?: Keys) => void
  private onTouchedCallback: () => void

  public value?: Keys

  private isTouched: boolean = false

  constructor() {}

  public registerKey(event: KeyboardEvent): void {
    event.preventDefault()
    this.markAsTouched()
    const keyCode: string = SHORTCUT_KEYS_MAPPINGS[event.code] ?? event.code

    const isKeyAlreadyRegistered: boolean = !!this.value && !this.isFirstKeyAfterFocus && this.value.some(key => key === keyCode)
    if (isKeyAlreadyRegistered) {
      return
    }

    this.value = this.isFirstKeyAfterFocus ? [keyCode] : [...this.value!, keyCode]
    if (this.isFirstKeyAfterFocus) {
      this.isFirstKeyAfterFocus = false
    }
    this.onChangeCallback?.(this.value)
  }

  private markAsTouched(): void {
    if (this.isTouched || !this.onTouchedCallback) {
      return
    }
    this.onTouchedCallback()
    this.isTouched = true
  }

  public markFirstKey(): void {
    this.isFirstKeyAfterFocus = true
  }

  public clearValue(): void {
    this.value = undefined
    this.onChangeCallback?.(undefined)
  }

  public writeValue(value: Keys): void {
    this.value = value
  }

  public registerOnChange(changeCallback: (value?: Keys) => void): void {
    this.onChangeCallback = changeCallback
  }

  public registerOnTouched(touchedCallback: () => void): void {
    this.onTouchedCallback = touchedCallback
  }
}
