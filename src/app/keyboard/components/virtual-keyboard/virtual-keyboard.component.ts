import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { KeyBindingMatcher } from '../../abstractions/key-binding-matcher.service'
import { Logger } from '../../../core/abstractions/logger.service'
import { StyledKeyBinding } from '../../value-objects/styled-key-binding'
import { KeyAliasService } from '../../abstractions/key-alias-service'
import { PhysicalKeyboardLayoutService } from '../../services/physical-keyboard-layout.service'
import { KeyboardLayout, KeyboardLayoutKey } from '../../value-objects/keyboard-layout'
import { KeyBinding } from '../../value-objects/key-binding'

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

  public keyboardLayoutMap: KeyboardLayoutMap = new Map()
  public physicalKeyboardLayout: KeyboardLayout

  private keyBindingsFilteredByModifiers: StyledKeyBinding[] = []
  private currentModifierKeystrokes: string[] = []
  private readonly logger: Logger

  constructor(
    private readonly keyBindingMatcher: KeyBindingMatcher,
    private readonly keyAliasService: KeyAliasService,
    logger: Logger
  ) {
    this.logger = logger.tag('VirtualKeyboardComponent')
    this.updatePhysicalKeyboardLayout()
    navigator.keyboard
      ?.getLayoutMap()
      .then(keyboardLayoutMap => (this.keyboardLayoutMap = new Map(keyboardLayoutMap)))
      .catch(error => this.logger.data(error).warn('Failed getting keyboard layout.'))
      .finally(() => this.updatePhysicalKeyboardLayout())
  }

  private updatePhysicalKeyboardLayout(): void {
    const physicalKeyboardLayoutService: PhysicalKeyboardLayoutService = new PhysicalKeyboardLayoutService(this.keyboardLayoutMap)
    this.physicalKeyboardLayout = physicalKeyboardLayoutService.createIso102KeyboardLayout()
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('keystrokes' in changes || 'keyBindings' in changes) {
      this.updateAvailableKeyBindings()
    }
  }

  private updateAvailableKeyBindings(): void {
    this.currentModifierKeystrokes = this.keystrokes.filter(keystroke => this.keyAliasService.isModifierKeyOrAliasedModifierKey(keystroke))
    this.keyBindingsFilteredByModifiers = this.keyBindings.filter(keyBinding => {
      const modifierKeys: string[] = (keyBinding.reroutedKeys ?? keyBinding.keys).filter(key => this.keyAliasService.isModifierKeyOrAliasedModifierKey(key))
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
    return this.keyBindingsFilteredByModifiers.find(keyBinding => this.isMatchingKeystrokes(keyBinding,emulatedKeystrokes))?.label
  }

  private isMatchingKeystrokes(keyBinding: StyledKeyBinding, keystrokes: string[]): boolean {
    return this.keyBindingMatcher.isMatchingKeystrokes(this.getKeyBindingToDisplay(keyBinding), keystrokes)
  }

  private getKeyBindingToDisplay(keyBinding: StyledKeyBinding): KeyBinding {
    return {
       ...keyBinding,
       keys: keyBinding.reroutedKeys ?? keyBinding.keys
    }
  }

  public getBackgroundForKey(key: string): string | undefined {
    const emulatedKeystrokes: string[] = [...this.currentModifierKeystrokes, key]
    return this.keyBindingsFilteredByModifiers.find(keyBinding => this.isMatchingKeystrokes(keyBinding, emulatedKeystrokes))?.background
  }

  public onExecuteActionsForKeystroke(keystroke: string): void {
    const emulatedKeystrokes: string[] = [...this.currentModifierKeystrokes, keystroke]
    this.keyBindingsFilteredByModifiers.filter(keyBinding => this.isMatchingKeystrokes(keyBinding, emulatedKeystrokes)).forEach(keyBinding => keyBinding.onMatched())
  }

  public trackKeyboardLayoutKey(_index: number, keyboardLayoutKey: KeyboardLayoutKey): string {
    return keyboardLayoutKey.key
  }
}
