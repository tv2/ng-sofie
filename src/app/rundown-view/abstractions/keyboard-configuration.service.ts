import { KeyBinding } from '../../keyboard/models/key-binding'
import { Subscription } from 'rxjs'
import { Rundown } from '../../core/models/rundown'

export abstract class KeyboardConfigurationService {
  public abstract init(rundown: Rundown, eventTarget: EventTarget): void
  public abstract subscribeToKeyBindings(onKeyBindingsChanged: (keyBindings: KeyBinding[]) => void): Subscription
  public abstract subscribeToKeystrokes(onKeystrokesChanged: (keystrokes: string[]) => void): Subscription
  public abstract destroy(): void
}
