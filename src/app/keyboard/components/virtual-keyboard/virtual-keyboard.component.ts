import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { KeyBinding } from '../../models/key-binding'
import { KeyBindingMatcher } from '../../abstractions/key-binding-matcher.service'
import { KeyEventType } from '../../value-objects/key-event-type'
import { Logger } from '../../../core/abstractions/logger.service'

const CHAR_CODE_FOR_A: number = 65


// TODO: Find better way.
const MODIFIER_KEYS: string[] = [
  'Control',
  'Shift',
  'Option',
  'Alt',
  'ControlLeft',
  'ShiftLeft',
  'OptionLeft',
  'AltLeft',
  'ControlRight',
  'ShiftRight',
  'OptionRight',
  'AltRight',
]

@Component({
  selector: 'sofie-virtual-keyboard',
  templateUrl: './virtual-keyboard.component.html',
  styleUrls: ['./virtual-keyboard.component.scss'],
})
export class VirtualKeyboardComponent implements OnChanges {
  @Input()
  public keyBindings: KeyBinding[]

  @Input()
  public keystrokes: string[]

  public keyboardLayout: KeyboardLayoutMap
  private readonly logger: Logger

  public readonly functionKeys: string[] = [...Array(12)].map((_, index: number) => `F${index + 1}`)
  public readonly digitKeys: string [] = [...Array(10)].map((_, index: number) => `Digit${(index + 1) % 10}`)
  public readonly numpadDigitKeys: string [] = [...Array(10)].map((_, index: number) => `Digit${(index + 1) % 10}`)
  public readonly physicalLayout: string[][] = [
    ['Escape', ...this.functionKeys],
    ['Backquote', ...this.digitKeys, 'Minus', 'Equal', 'Backspace'],
    ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight'],
    ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Backslash', 'Enter'],
    ['ShiftLeft', 'IntlBackslash', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight'],
    ['ControlLeft', 'OSLeft', 'AltLeft', 'Space', 'AltRight', 'OSRight', 'ContextMenu', 'ControlRight'],
  ]

  private keyBindingsFilteredByModifiers: KeyBinding[]

  constructor(private readonly keyBindingMatcher: KeyBindingMatcher, logger: Logger) {
    this.keyboardLayout = this.createKeyboardLayout()
    navigator.keyboard?.getLayoutMap()
        .then(keyboardLayout => this.keyboardLayout = this.updateKeyboardLayout(keyboardLayout))
        .catch(error => this.logger.data(error).warn('Failed getting keyboard layout.'))
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('keystrokes' in changes || 'keyBindings' in changes) {
      const modifierKeystrokes: string[] = this.keystrokes.filter(keystroke => MODIFIER_KEYS.includes(keystroke))
      this.keyBindingsFilteredByModifiers = this.keyBindings.filter(keyBinding => {
        const modifierKeys: string[] = keyBinding.keys.filter(key => MODIFIER_KEYS.includes(key))
        return modifierKeystrokes.every(keystroke => modifierKeys.includes(keystroke)) && modifierKeys.length === modifierKeystrokes.length
      })
    }
  }

  public isKeystrokeMatched(keystroke: string): boolean {
    return this.keystrokes.includes(keystroke)
  }

  public getLabelOfKey(keystroke: string): string | undefined {
    const modifierKeystrokes: string[] = this.keystrokes.filter(keystroke => MODIFIER_KEYS.includes(keystroke))
    const emulatedKeystrokes: string[] = [...modifierKeystrokes, keystroke]
    return this.keyBindingsFilteredByModifiers.find(keyBinding => this.keyBindingMatcher.isMatchingKeystrokes(keyBinding, emulatedKeystrokes))?.label
  }
  public getKeyWeight(key: string): number {
    switch (key) {
      case 'Escape':
      case 'Tab':
        return 1.5
      case 'Backspace':
      case 'CapsLock':
        return 2
      case 'ShiftLeft':
        return 1.3
      case 'ShiftRight':
        return 2.85
      case 'ControlLeft':
        return 1.4
      case 'ControlRight':
        return 1.95
      case 'Space':
        return 7.42
      case 'F1':
      case 'F2':
      case 'F3':
      case 'F4':
      case 'F5':
      case 'F6':
      case 'F7':
      case 'F8':
      case 'F9':
      case 'F10':
      case 'F11':
      case 'F12':
        return 1.137
    }
    return 1
  }

  private createKeyboardLayout(): KeyboardLayoutMap {
    return new Map([
        ...this.createAlphaKeyKeyboardLayoutEntries(),
        ...this.createNumericKeyKeyboardLayoutEntries(),
        ...this.createSpecialKeyKeyboardLayoutEntries(),
    ])
  }

  private createAlphaKeyKeyboardLayoutEntries(): [string, string][] {
    return [...Array(26)]
        .map((_, index) => index + CHAR_CODE_FOR_A)
        .map(charCode => String.fromCharCode(charCode))
        .map(character => [`Key${character}`, character])
  }

  private createNumericKeyKeyboardLayoutEntries(): [string, string][] {
    return [...this.digitKeys, ...this.numpadDigitKeys].map(digitKey => [digitKey, digitKey.replace(/^(Digit|Numpad)/, '')])
  }

  private createSpecialKeyKeyboardLayoutEntries(): [string, string][] {
    return [
      ['Tab', '\u{21E5} Tab'],
      ['ControlLeft', '\u{2303} Control'],
      ['ControlRight', '\u{2303} Control'],
      ['ShiftLeft', '\u{21E7} Shift'],
      ['ShiftRight', '\u{21E7} Shift'],
      ['CapsLock', '\u{21EA} CapsLock'],
      ['AltLeft', '\u{2325} Option'],
      ['AltRight', '\u{2325} Option'],
      ['Space', 'Space'],
    ]
  }

  private updateKeyboardLayout(keyboardLayout: KeyboardLayoutMap): KeyboardLayoutMap {
    return new Map([
        ...this.keyboardLayout,
        ...keyboardLayout.entries(),
    ])
  }

  public displayKeyBinding(keyBinding: KeyBinding): string {
    return keyBinding.keys.map(key => this.getDisplayKey(key)).join(' + ')
  }

  private getDisplayKey(key: string): string {
    const mappedKey: string | undefined =  this.keyboardLayout?.get(key)
    if (mappedKey) {
      return mappedKey
    }
    return key.replace('Digit', '').replace('Numpad', '').replace('Key', '').replace('Left', '').replace('Right', '')
  }

  public isKeyBindingMatched(keyBinding: KeyBinding): boolean {
    return this.keyBindingMatcher.isMatching(keyBinding, this.keystrokes, KeyEventType.RELEASED)
  }
}
