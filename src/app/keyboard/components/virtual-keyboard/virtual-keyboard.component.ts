import { Component, ElementRef, HostBinding, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core'
import { KeyBindingMatcher } from '../../abstractions/key-binding-matcher.service'
import { Logger } from '../../../core/abstractions/logger.service'
import { StyledKeyBinding } from '../../value-objects/styled-key-binding'
import { KeyAliasService } from '../../abstractions/key-alias-service'
import { PhysicalKeyboardLayoutFactory } from '../../factories/physical-keyboard-layout.factory'
import { KeyboardLayout, KeyboardLayoutKey } from '../../value-objects/keyboard-layout'
import { debounceTime, Subject } from 'rxjs'

const CHAR_CODE_FOR_A: number = 65
const RESIZE_DEBOUNCE_DURATION_IN_MS: number = 10
const NUMBER_OF_KEYS_IN_FULL_ROW: number = 21
const KEY_GAP_TO_KEY_SIZE_RATIO: number = 8

@Component({
  selector: 'sofie-virtual-keyboard',
  templateUrl: './virtual-keyboard.component.html',
  styleUrls: ['./virtual-keyboard.component.scss'],
})
export class VirtualKeyboardComponent implements OnChanges {
  @Input()
  public keyBindings: StyledKeyBinding[]

  @Input()
  public keystrokes: string[]

  public keyboardLayoutMap: KeyboardLayoutMap
  private readonly logger: Logger

  public readonly functionKeys: string[] = [...Array(12)].map((_, index: number) => `F${index + 1}`)
  public readonly digitKeys: string[] = [...Array(10)].map((_, index: number) => `Digit${(index + 1) % 10}`)
  public readonly numpadDigitKeys: string[] = [...Array(10)].map((_, index: number) => `Digit${(index + 1) % 10}`)
  public readonly physicalKeyboardLayout: KeyboardLayout

  private keyBindingsFilteredByModifiers: StyledKeyBinding[] = []
  private currentModifierKeystrokes: string[] = []

  constructor(
    private readonly physicalKeyboardLayoutFactory: PhysicalKeyboardLayoutFactory,
    private readonly keyBindingMatcher: KeyBindingMatcher,
    private readonly keyAliasService: KeyAliasService,
    private readonly hostElement: ElementRef,
    logger: Logger
  ) {
    this.logger = logger.tag('VirtualKeyboardComponent')
    this.physicalKeyboardLayout = this.physicalKeyboardLayoutFactory.createIso102KeyboardLayout()
    this.keyboardLayoutMap = this.createKeyboardLayout()
    navigator.keyboard
      ?.getLayoutMap()
      .then(keyboardLayoutMap => (this.keyboardLayoutMap = this.updateKeyboardLayoutMap(keyboardLayoutMap)))
      .catch(error => this.logger.data(error).warn('Failed getting keyboard layout.'))
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('keystrokes' in changes || 'keyBindings' in changes) {
      this.updateAvailableKeyBindings()
    }
  }

  private updateAvailableKeyBindings(): void {
    this.currentModifierKeystrokes = this.keystrokes.filter(keystroke => this.keyAliasService.isModifierKeyOrAliasedModifierKey(keystroke))
    this.keyBindingsFilteredByModifiers = this.keyBindings.filter(keyBinding => {
      const modifierKeys: string[] = keyBinding.keys.filter(key => this.keyAliasService.isModifierKeyOrAliasedModifierKey(key))
      if (modifierKeys.length !== this.currentModifierKeystrokes.length) {
        return false
      }
      const isModifiersPartialOfKeyBindingModifiers: boolean = this.currentModifierKeystrokes.every(keystroke =>
        modifierKeys.some(modifierKey => this.keyAliasService.isKeyPartOfAlias(keystroke, modifierKey))
      )
      return isModifiersPartialOfKeyBindingModifiers
    })
  }

  public isKeystrokeMatched(keystroke: string): boolean {
    return this.keystrokes.includes(keystroke)
  }

  public getLabelOfKey(keystroke: string): string | undefined {
    const emulatedKeystrokes: string[] = [...this.currentModifierKeystrokes, keystroke]
    return this.keyBindingsFilteredByModifiers.find(keyBinding => this.keyBindingMatcher.isMatchingKeystrokes(keyBinding, emulatedKeystrokes))?.label
  }

  public getBackgroundForKey(key: string): string | undefined {
    const emulatedKeystrokes: string[] = [...this.currentModifierKeystrokes, key]
    return this.keyBindingsFilteredByModifiers.find(keyBinding => this.keyBindingMatcher.isMatchingKeystrokes(keyBinding, emulatedKeystrokes))?.background
  }

  public onExecuteActionsForKeystroke(keystroke: string): void {
    const emulatedKeystrokes: string[] = [...this.currentModifierKeystrokes, keystroke]
    this.keyBindingsFilteredByModifiers.filter(keyBinding => this.keyBindingMatcher.isMatchingKeystrokes(keyBinding, emulatedKeystrokes)).forEach(keyBinding => keyBinding.onMatched())
  }

  private createKeyboardLayout(): KeyboardLayoutMap {
    return new Map([...this.createAlphaKeyKeyboardLayoutEntries(), ...this.createNumericKeyKeyboardLayoutEntries(), ...this.createSpecialKeyKeyboardLayoutEntries()])
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

  private updateKeyboardLayoutMap(keyboardLayout: KeyboardLayoutMap): KeyboardLayoutMap {
    return new Map([...this.keyboardLayoutMap, ...keyboardLayout.entries()])
  }

  public trackKeyboardLayoutKey(_index: number, keyboardLayoutKey: KeyboardLayoutKey): string {
    return keyboardLayoutKey.key
  }
}
