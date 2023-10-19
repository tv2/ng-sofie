import { KeyBindingMatcher } from '../abstractions/key-binding-matcher.service'
import { KeyBinding } from '../value-objects/key-binding'
import { KeyEventType } from '../value-objects/key-event-type'
import { Injectable } from '@angular/core'
import { KeyAliasService } from '../abstractions/key-alias-service'

@Injectable()
export class Tv2KeyBindingMatcher implements KeyBindingMatcher {
  constructor(private readonly keyAliasService: KeyAliasService) {}

  public isMatching(keyBinding: KeyBinding, keystrokes: string[], keyEventType: KeyEventType): boolean {
    return this.doesKeystrokeRelatedPropertiesMatch(keyBinding, keystrokes) && this.doesKeyEventTypeMatch(keyBinding, keyEventType)
  }

  public isMatchingKeystrokes(keyBinding: KeyBinding, keystrokes: string[]): boolean {
    return this.doesKeystrokeRelatedPropertiesMatch(keyBinding, keystrokes)
  }

  private doesKeystrokeRelatedPropertiesMatch(keyBinding: KeyBinding, keystrokes: string[]): boolean {
    return this.doesExclusivityMatch(keyBinding, keystrokes) && this.doesOrderingMatch(keyBinding, keystrokes)
  }

  private doesExclusivityMatch(keyBinding: KeyBinding, keystrokes: string[]): boolean {
    if (!keyBinding.useExclusiveMatching) {
      return this.doesKeystrokesContainAllKeys(keyBinding, keystrokes)
    }
    return this.isKeyBindingAnExclusiveMatch(keyBinding, keystrokes)
  }

  private doesKeystrokesContainAllKeys(keyBinding: KeyBinding, keystrokes: string[]): boolean {
    return keyBinding.keys.every(key => this.keyAliasService.getAliasesForKey(key).some(keyAlias => keystrokes.includes(keyAlias)))
  }

  private isKeyBindingAnExclusiveMatch(keyBinding: KeyBinding, keystrokes: string[]): boolean {
    return this.doesKeystrokesContainAllKeys(keyBinding, keystrokes) && keyBinding.keys.length === keystrokes.length
  }

  private doesOrderingMatch(keyBinding: KeyBinding, keystrokes: string[]): boolean {
    if (!keyBinding.useOrderedMatching) {
      return true
    }
    return this.doesKeystrokesMatchKeyBindingOrder(keyBinding, keystrokes)
  }

  private doesKeystrokesMatchKeyBindingOrder(keyBinding: KeyBinding, keystrokes: string[]): boolean {
    const exclusiveKeystrokes: string[] = keystrokes.filter(keystroke => keyBinding.keys.includes(keystroke))
    const hasSameLength: boolean = keyBinding.keys.length === exclusiveKeystrokes.length
    return hasSameLength && keyBinding.keys.every((key, index) => this.areKeysMatching(exclusiveKeystrokes[index], key))
  }

  private areKeysMatching(firstKey: string, secondKey: string): boolean {
    const firstKeyAliases: string[] = this.keyAliasService.getAliasesForKey(firstKey)
    const secondKeyAliases: string[] = this.keyAliasService.getAliasesForKey(secondKey)
    return [...firstKeyAliases].some(firstKeyAlias => secondKeyAliases.includes(firstKeyAlias))
  }

  private doesKeyEventTypeMatch(keyBinding: KeyBinding, keyEventType: KeyEventType): boolean {
    const isKeyReleased: boolean = keyEventType === KeyEventType.RELEASED
    return keyBinding.shouldMatchOnKeyRelease === isKeyReleased
  }

  public shouldPreventDefaultBehaviour(keyBinding: KeyBinding, keystrokes: string[], keyEventType: KeyEventType): boolean {
    return this.doesPartialMatchingMatch(keyBinding, keystrokes) || this.doesKeyEventTypePreventDefaultBehaviour(keyBinding, keystrokes, keyEventType)
  }

  private doesPartialMatchingMatch(keyBinding: KeyBinding, keystrokes: string[]): boolean {
    if (!keyBinding.shouldPreventDefaultBehaviourForPartialMatches) {
      return false
    }
    if (keystrokes.length === 0) {
      return false
    }
    if (keyBinding.useExclusiveMatching && !this.isKeyBindingAPartialExclusiveMatch(keyBinding, keystrokes)) {
      return false
    }
    if (keyBinding.useOrderedMatching && !this.doesKeystrokeOrderMatchIntersectionWithKeyBinding(keyBinding, keystrokes)) {
      return false
    }
    return this.isKeyBindingAPartialNonExclusiveMatch(keyBinding, keystrokes)
  }

  private isKeyBindingAPartialExclusiveMatch(keyBinding: KeyBinding, keystrokes: string[]): boolean {
    const keyAliases: string[] = keyBinding.keys.flatMap(key => this.keyAliasService.getAliasesForKey(key))
    return keystrokes.every(keystroke => keyAliases.includes(keystroke))
  }

  private isKeyBindingAPartialNonExclusiveMatch(keyBinding: KeyBinding, keystrokes: string[]): boolean {
    const keyAliases: string[] = keyBinding.keys.flatMap(key => this.keyAliasService.getAliasesForKey(key))
    return keyAliases.some(key => keystrokes.includes(key))
  }

  private doesKeystrokeOrderMatchIntersectionWithKeyBinding(keyBinding: KeyBinding, keystrokes: string[]): boolean {
    const exclusiveKeys = keyBinding.keys.filter(key => keystrokes.includes(key))
    const exclusiveKeystrokes: string[] = keystrokes.filter(keystroke => exclusiveKeys.includes(keystroke))
    const hasSameLength: boolean = exclusiveKeys.length === exclusiveKeystrokes.length
    return hasSameLength && exclusiveKeys.every((key, index) => this.areKeysMatching(exclusiveKeystrokes[index], key))
  }

  private doesKeyEventTypePreventDefaultBehaviour(keyBinding: KeyBinding, keystrokes: string[], keyEventType: KeyEventType): boolean {
    if (!keyBinding.shouldPreventDefaultBehaviourOnKeyPress) {
      return false
    }
    const isKeyPressed: boolean = keyEventType === KeyEventType.PRESSED
    return isKeyPressed && this.doesKeystrokeRelatedPropertiesMatch(keyBinding, keystrokes)
  }
}
