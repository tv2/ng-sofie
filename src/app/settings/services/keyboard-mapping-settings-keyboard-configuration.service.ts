import { BehaviorSubject, Subject, Subscription } from 'rxjs'
import { Injectable } from '@angular/core'
import { KeyBindingEventService } from '../../keyboard/abstractions/key-binding-event.service'
import { KeyBinding } from '../../keyboard/value-objects/key-binding'
import { KeyboardConfigurationService } from '../abstractions/keyboard-configuration.service'

@Injectable()
export class KeyboardMappingSettingsKeyboardConfiguration implements KeyboardConfigurationService {
  private keystrokes: string[] = []
  private readonly keyBindings: KeyBinding[] = []

  private readonly keyBindingsSubject: Subject<KeyBinding[]>
  private readonly keystrokesSubject: Subject<string[]>

  constructor(private readonly keyBindingEventService: KeyBindingEventService) {
    this.keystrokesSubject = new BehaviorSubject(this.keystrokes)
  }

  public init(rundownId: string, eventAreaNode: Node): void {
    this.keyBindingEventService.subscribeToKeystrokesOn(eventAreaNode).subscribe(this.updateKeystrokes.bind(this))
  }

  private updateKeystrokes(keystrokes: string[]): void {
    // eslint-disable-next-line no-console
    console.log('updateKeystrokes')
    this.keystrokes = keystrokes
    this.keystrokesSubject.next(this.keystrokes)
  }

  public subscribeToKeystrokes(onKeystrokesChanged: (keystrokes: string[]) => void): Subscription {
    return this.keystrokesSubject.subscribe(onKeystrokesChanged)
  }

  public destroy(): void {
    this.keyBindingEventService.unsubscribeFromKeystrokes()
  }
}
