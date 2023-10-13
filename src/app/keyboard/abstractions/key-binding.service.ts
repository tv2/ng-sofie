import { Observable } from 'rxjs'
import { KeyBinding } from '../models/key-binding'

export abstract class KeyBindingService {
  public abstract subscribeToKeystrokesOn(node: Node): Observable<string[]>
  public abstract defineKeyBindings(keybindings: KeyBinding[]): void
  public abstract unsubscribeFromKeystrokes(): void
}
