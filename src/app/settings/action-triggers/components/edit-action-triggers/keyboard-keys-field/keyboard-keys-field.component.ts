import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Tv2PartAction } from 'src/app/shared/models/tv2-action'
import { IconButton, IconButtonSize } from 'src/app/shared/enums/icon-button'
import { SHORTCUT_KEYS_MAPPINGS } from 'src/app/shared/models/keyboard-trigger'

@Component({
  selector: 'sofie-keyboard-keys-field',
  templateUrl: './keyboard-keys-field.component.html',
  styleUrls: ['./keyboard-keys-field.component.scss'],
})
export class KeyboardKeysFieldComponent {
  @Output() public readonly onChange: EventEmitter<string[]> = new EventEmitter<string[]>()
  @Input() public value: string[]
  @Input() public isSubmitting: boolean
  @Input() public label: string
  @Input() public isRequired?: boolean
  @Input() public helpIconText?: string
  public readonly IconButton = IconButton
  public readonly IconButtonSize = IconButtonSize

  public isFirstKeyAfterUserFocus: boolean
  public selectedAction: Tv2PartAction | undefined

  public onKeyDown(event: KeyboardEvent): void {
    event.preventDefault()
    const newKeyCode: string = SHORTCUT_KEYS_MAPPINGS[event.code] ?? event.code
    const currentKeys: string[] = this.value ?? []
    if (currentKeys.some(keyCode => keyCode === newKeyCode) && !this.isFirstKeyAfterUserFocus) {
      return
    }
    const keys: string[] = this.isFirstKeyAfterUserFocus ? [newKeyCode] : [...this.value, newKeyCode]
    this.onChange.emit(keys)
    if (this.isFirstKeyAfterUserFocus) {
      this.setFirstKeyAfterUserFocus(false)
    }
  }

  public setFirstKeyAfterUserFocus(isFirstKey: boolean): void {
    this.isFirstKeyAfterUserFocus = isFirstKey
  }

  public clearKeyboardField(): void {
    this.onChange.emit([])
  }
}
