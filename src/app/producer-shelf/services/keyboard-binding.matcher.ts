import { KeyBinding } from '../models/key-binding'

export class KeyboardBindingMatcher {
    public isKeyBindingMatched(keyBinding: KeyBinding, pressedKeys: string[]): boolean {
        const keys: string[] = [...keyBinding.modifiers, keyBinding.key]
        return keys.every(key => pressedKeys.includes(key))
    }

    public isKeyBindingMatchedExactly(keyBinding: KeyBinding, pressedKeys: string[]): boolean {
        const keys: string[] = [...keyBinding.modifiers, keyBinding.key]
        return keys.every(key => pressedKeys.includes(key)) && pressedKeys.length === keys.length
    }
}

