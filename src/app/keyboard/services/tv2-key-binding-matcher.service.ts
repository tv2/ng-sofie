import { KeyBindingMatcher } from '../abstractions/key-binding-matcher.service'
import { KeyBinding } from '../models/key-binding'

type Matcher = () => boolean

export class Tv2KeyBindingMatcher implements KeyBindingMatcher {
  public isMatching(keyBinding: KeyBinding, keystrokes: string[], isKeyReleased: boolean): boolean {
    return [...this.createKeystrokesRelatedKeyBindingMatchers(keyBinding, keystrokes), this.createKeyEventTypeMatcher(keyBinding, isKeyReleased)].every(matcher => matcher())
  }

  private createKeystrokesRelatedKeyBindingMatchers(keyBinding: KeyBinding, keystrokes: string[]): Matcher[] {
    return [this.createExclusivityMatcher(keyBinding, keystrokes), this.createOrderingMatcher(keyBinding, keystrokes)]
  }

  private doesKeystrokesContainAllKeys(keyBinding: KeyBinding, keystrokes: string[]): boolean {
    return keyBinding.keys.every(key => keystrokes.includes(key))
  }

  private createExclusivityMatcher(keyBinding: KeyBinding, keystrokes: string[]): Matcher {
    if (!keyBinding.useExclusiveMatching) {
      return () => this.doesKeystrokesContainAllKeys(keyBinding, keystrokes)
    }
    return () => this.isKeyBindingAnExclusiveMatch(keyBinding, keystrokes)
  }

  private isKeyBindingAnExclusiveMatch(keyBinding: KeyBinding, keystrokes: string[]): boolean {
    return this.doesKeystrokesContainAllKeys(keyBinding, keystrokes) && keyBinding.keys.length === keystrokes.length
  }

  private createOrderingMatcher(keyBinding: KeyBinding, keystrokes: string[]): Matcher {
    if (!keyBinding.useOrderedMatching) {
      return () => true
    }
    return () => this.doesKeystrokesMatchKeyBindingOrder(keyBinding, keystrokes)
  }

  private doesKeystrokesMatchKeyBindingOrder(keyBinding: KeyBinding, keystrokes: string[]): boolean {
    const exclusiveKeystrokes: string[] = keystrokes.filter(keystroke => keyBinding.keys.includes(keystroke))
    const hasSameLength: boolean = keyBinding.keys.length === exclusiveKeystrokes.length
    return hasSameLength && keyBinding.keys.every((key, index) => exclusiveKeystrokes[index] === key)
  }

  private createKeyEventTypeMatcher(keyBinding: KeyBinding, isKeyReleased: boolean): Matcher {
    return () => keyBinding.shouldMatchOnKeyRelease === isKeyReleased
  }

  public shouldPreventDefaultBehaviour(keyBinding: KeyBinding, keystrokes: string[], isKeyReleased: boolean): boolean {
    return [this.createPartialMatchMatcher(keyBinding, keystrokes), this.createPreventDefaultBehaviourOnKeyPressMatcher(keyBinding, keystrokes, isKeyReleased)].some(matcher => matcher())
  }

  private createPartialMatchMatcher(keyBinding: KeyBinding, keystrokes: string[]): Matcher {
    if (!keyBinding.shouldPreventDefaultBehaviourForPartialMatches) {
      return () => false
    }
    if (keystrokes.length === 0) {
      return () => false
    }
    if (keyBinding.useExclusiveMatching && !this.isKeyBindingAPartialExclusiveMatch(keyBinding, keystrokes)) {
      return () => false
    }
    if (keyBinding.useOrderedMatching && !this.doesKeystrokeOrderMatchIntersectionWithKeyBinding(keyBinding, keystrokes)) {
      return () => false
    }
    return () => this.isKeyBindingAPartialNonExclusiveMatch(keyBinding, keystrokes)
  }

  private isKeyBindingAPartialExclusiveMatch(keyBinding: KeyBinding, keystrokes: string[]): boolean {
    return keystrokes.every(keystroke => keyBinding.keys.includes(keystroke))
  }

  private isKeyBindingAPartialNonExclusiveMatch(keyBinding: KeyBinding, keystrokes: string[]): boolean {
    return keyBinding.keys.some(key => keystrokes.includes(key))
  }

  private doesKeystrokeOrderMatchIntersectionWithKeyBinding(keyBinding: KeyBinding, keystrokes: string[]): boolean {
    const exclusiveKeys = keyBinding.keys.filter(key => keystrokes.includes(key))
    const exclusiveKeystrokes: string[] = keystrokes.filter(keystroke => exclusiveKeys.includes(keystroke))
    const hasSameLength: boolean = exclusiveKeys.length === exclusiveKeystrokes.length
    return hasSameLength && exclusiveKeys.every((key, index) => exclusiveKeystrokes[index] === key)
  }

  private createPreventDefaultBehaviourOnKeyPressMatcher(keyBinding: KeyBinding, keystrokes: string[], isKeyReleased: boolean): Matcher {
    if (!keyBinding.shouldPreventDefaultBehaviourOnKeyPress) {
      return () => false
    }
    return () => !isKeyReleased && this.createKeystrokesRelatedKeyBindingMatchers(keyBinding, keystrokes).every(matcher => matcher())
  }
}
