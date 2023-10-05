import { Subscription } from 'rxjs'
import { KeyBinding } from '../models/key-binding'
import { OnDestroy } from '@angular/core'

export abstract class KeyboardBindingService implements OnDestroy {
  public abstract subscribeToKeybindings(callback: (keyBindings: KeyBinding[]) => void): Subscription
  public abstract subscribeToPressedKeys(callback: (pressedKeys: string[]) => void): Subscription
  public abstract ngOnDestroy(): void
}
