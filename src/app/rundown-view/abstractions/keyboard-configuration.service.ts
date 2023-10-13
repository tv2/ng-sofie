import { KeyBinding } from '../../keyboard/models/key-binding'
import { Subscription } from 'rxjs'

export abstract class KeyboardConfigurationService {
  public abstract init(rundownId: string, eventTarget: EventTarget): void
  public abstract subscribeToKeyBindings(onKeyBindingsChanged: (keyBindings: KeyBinding[]) => void): Subscription
  public abstract subscribeToKeystrokes(onKeystrokesChanged: (keystrokes: string[]) => void): Subscription
  public abstract destroy(): void
}
