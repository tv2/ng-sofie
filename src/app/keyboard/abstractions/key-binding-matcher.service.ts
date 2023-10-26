import { KeyBinding } from '../value-objects/key-binding'
import { KeyEventType } from '../value-objects/key-event-type'

export abstract class KeyBindingMatcher {
  public abstract isMatching(keyBinding: KeyBinding, keystrokes: string[], keyEventType: KeyEventType): boolean
  public abstract isMatchingKeystrokes(keyBinding: KeyBinding, keystrokes: string[]): boolean
  public abstract shouldPreventDefaultBehaviour(keyBinding: KeyBinding, keystrokes: string[], keyEventType: KeyEventType): boolean
}
