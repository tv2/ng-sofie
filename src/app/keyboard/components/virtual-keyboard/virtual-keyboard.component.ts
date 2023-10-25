import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { KeyBindingMatcher } from '../../abstractions/key-binding-matcher.service'
import { Logger } from '../../../core/abstractions/logger.service'
import { StyledKeyBinding } from '../../value-objects/styled-key-binding'
import { KeyAliasService } from '../../abstractions/key-alias-service'
import { KeyboardLayout, KeyboardLayoutKey } from '../../value-objects/keyboard-layout'
import { PhysicalKeyboardLayoutService } from '../../abstractions/physical-keyboard-layout.service'
import { KeyboardKeyLabelService } from '../../abstractions/keyboard-key-label.service'

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

  public keyLabels: KeyboardLayoutMap = new Map()
  public physicalKeyboardLayout: KeyboardLayout

  private keyBindingsFilteredByModifiers: StyledKeyBinding[] = []
  private currentModifierKeystrokes: string[] = []
  private readonly logger: Logger

  constructor(
    private readonly physicalKeyboardLayoutService: PhysicalKeyboardLayoutService,
    private readonly keyboardKeyLabelService: KeyboardKeyLabelService,
    private readonly keyBindingMatcher: KeyBindingMatcher,
    private readonly keyAliasService: KeyAliasService,
    logger: Logger
  ) {
    this.logger = logger.tag('VirtualKeyboardComponent')
    this.keyLabels = this.keyboardKeyLabelService.getDefaultKeyLabels()
    this.updatePhysicalKeyboardLayout()
    this.keyboardKeyLabelService
      .getLocalKeyboardKeyLabels()
      .then(keyLabels => (this.keyLabels = new Map(keyLabels)))
      .catch(error => this.logger.data(error).warn('Failed getting keyboard layout.'))
      .finally(() => this.updatePhysicalKeyboardLayout())
  }

  private updatePhysicalKeyboardLayout(): void {
    this.physicalKeyboardLayoutService.registerKeyboardKeyLabels(this.keyLabels)
    this.physicalKeyboardLayout = this.physicalKeyboardLayoutService.getPhysicalKeyboardLayout()
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

  public getKeyboardLayoutMappedKey(key: string): string {
    return this.keyLabels.get(key) ?? key
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

  public trackKeyboardLayoutKey(_index: number, keyboardLayoutKey: KeyboardLayoutKey): string {
    return keyboardLayoutKey.key
  }
}
