import { KeyBinding } from '../models/key-binding'

export abstract class KeyBindingMatcher {
  public abstract isMatching(keyBinding: KeyBinding, keystrokes: string[], isKeyReleased: boolean): boolean
  public abstract shouldPreventDefaultBehaviour(keyBinding: KeyBinding, keystrokes: string[], isKeyReleased: boolean): boolean
}
