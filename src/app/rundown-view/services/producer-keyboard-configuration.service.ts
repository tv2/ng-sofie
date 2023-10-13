import { BehaviorSubject, Subject, Subscription } from 'rxjs'
import { Injectable } from '@angular/core'
import { KeyBindingService } from '../../keyboard/abstractions/key-binding.service'
import { KeyBinding } from '../../keyboard/models/key-binding'
import { ProducerKeyBindingService } from '../abstractions/producer-key-binding.service'
import { KeyboardConfigurationService } from '../abstractions/keyboard-configuration.service'

@Injectable()
export class ProducerKeyboardConfigurationService implements KeyboardConfigurationService {
  private keyBindings: KeyBinding[]
  private keystrokes: string[] = []
  private readonly keyBindingsSubject: Subject<KeyBinding[]>
  private readonly keystrokesSubject: Subject<string[]>

  constructor(
    private readonly keyBindingService: KeyBindingService,
    private readonly producerKeyBindingService: ProducerKeyBindingService
  ) {
    this.keyBindingsSubject = new BehaviorSubject(this.keyBindings)
    this.keystrokesSubject = new BehaviorSubject(this.keystrokes)
  }

  public init(rundownId: string, eventAreaNode: Node): void {
    this.producerKeyBindingService.init(rundownId)
    this.producerKeyBindingService.subscribeToKeyBindings().subscribe(this.updateKeyBindings.bind(this))
    this.keyBindingService.subscribeToKeystrokesOn(eventAreaNode).subscribe(this.updateKeystrokes.bind(this))
    this.keyBindingService.defineKeyBindings(this.keyBindings)
  }

  private updateKeyBindings(keyBindings: KeyBinding[]): void {
    this.keyBindings = keyBindings
    this.keyBindingsSubject.next(this.keyBindings)
    this.keyBindingService.defineKeyBindings(this.keyBindings)
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
    this.keyBindingService.unsubscribeFromKeystrokes()
  }
}
