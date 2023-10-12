import { BehaviorSubject, Subject, Subscription } from 'rxjs'
import { Injectable } from '@angular/core'
import { KeyBindingService } from '../../keyboard/abstractions/key-binding.service'
import { KeyBinding } from '../../keyboard/models/key-binding'
import { ProducerKeyBindingService } from '../abstractions/producer-key-binding.service'
import { KeyboardConfigurationService } from '../abstractions/keyboard-configuration.service'
import { Rundown } from '../../core/models/rundown'

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
    // TODO: Don't take it directly from URL
    const { rundownId } = window.location.pathname.match(/rundowns\/(?<rundownId>.+)\/?/)?.groups ?? {}
    if (!rundownId) {
      throw new Error('Failed getting rundown id.')
    }
    this.keyBindingsSubject = new BehaviorSubject(this.keyBindings)
    this.keystrokesSubject = new BehaviorSubject(this.keystrokes)
  }

  public init(rundown: Rundown, eventTarget: EventTarget): void {
    console.log('EVENTARGET', eventTarget)
    this.producerKeyBindingService.init(rundown)
    this.producerKeyBindingService.subscribeToKeyBindings().subscribe(keyBindings => this.updateKeyBindings(keyBindings))
    this.keyBindingService.subscribeToKeystrokesOn(eventTarget).subscribe(keystrokes => {
      this.keystrokes = keystrokes
      this.keystrokesSubject.next(this.keystrokes)
    })
    this.keyBindingService.defineKeyBindings(this.keyBindings)
  }

  private updateKeyBindings(keyBindings: KeyBinding[]): void {
    this.keyBindings = keyBindings
    this.keyBindingsSubject.next(this.keyBindings)
    this.keyBindingService.defineKeyBindings(this.keyBindings)
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
