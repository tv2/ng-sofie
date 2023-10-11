import { Observable } from 'rxjs'
import { KeyBinding } from '../models/key-binding'

export abstract class KeyBindingService {
  public abstract subscribeToKeystrokesOn(element: EventTarget): Observable<string[]>
  public abstract defineKeyBindings(keybindings: KeyBinding[]): void
  public abstract unsubscribeFromKeystrokes(): void
}
