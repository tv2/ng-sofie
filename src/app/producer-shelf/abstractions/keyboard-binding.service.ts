import { Subscription } from 'rxjs'
import { KeyBinding } from '../models/key-binding'

export abstract class KeyboardBindingService {
    public abstract subscribeToKeybindings(callback: (keyBindings: KeyBinding[]) => void): Subscription
    public abstract subscribeToPressedKeys(callback: (pressedKeys: string[]) => void): Subscription
}
