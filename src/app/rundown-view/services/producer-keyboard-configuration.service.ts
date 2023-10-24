import { BehaviorSubject, Subject, Subscription } from 'rxjs'
import { Injectable } from '@angular/core'
import { KeyBindingEventService } from '../../keyboard/abstractions/key-binding-event.service'
import { KeyBinding } from '../../keyboard/models/key-binding'
import { KeyBindingService } from '../abstractions/key-binding.service'
import { KeyboardConfigurationService } from '../abstractions/keyboard-configuration.service'

@Injectable()
export class ProducerKeyboardConfigurationService implements KeyboardConfigurationService {
  private keyBindings: KeyBinding[]
  private keystrokes: string[] = []
  private readonly keyBindingsSubject: Subject<KeyBinding[]>
  private readonly keystrokesSubject: Subject<string[]>

  constructor(
    private readonly keyBindingEventService: KeyBindingEventService,
    private readonly producerKeyBindingService: KeyBindingService
  ) {
    this.keyBindingsSubject = new BehaviorSubject(this.keyBindings)
    this.keystrokesSubject = new BehaviorSubject(this.keystrokes)
  }

  public init(rundownId: string, eventAreaNode: Node): void {
    this.producerKeyBindingService.init(rundownId)
    this.producerKeyBindingService.subscribeToKeyBindings().subscribe(this.updateKeyBindings.bind(this))
    this.keyBindingEventService.subscribeToKeystrokesOn(eventAreaNode).subscribe(this.updateKeystrokes.bind(this))
    this.keyBindingEventService.defineKeyBindings(this.keyBindings)
  }

  private updateKeyBindings(keyBindings: KeyBinding[]): void {
    this.keyBindings = keyBindings
    this.keyBindingsSubject.next(this.keyBindings)
    this.keyBindingEventService.defineKeyBindings(this.keyBindings)
  }

  private updateKeystrokes(keystrokes: string[]): void {
    this.keystrokes = keystrokes
    this.keystrokesSubject.next(this.keystrokes)
  }

  public subscribeToKeyBindings(onKeyBindingsChanged: (keyBindings: KeyBinding[]) => void): Subscription {
    return this.keyBindingsSubject.subscribe(onKeyBindingsChanged)
  }

  public subscribeToKeystrokes(onKeystrokesChanged: (keystrokes: string[]) => void): Subscription {
    return this.keystrokesSubject.subscribe(onKeystrokesChanged)
  }

  public destroy(): void {
    this.keyBindingEventService.unsubscribeFromKeystrokes()
  }
}
