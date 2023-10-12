import { KeyboardBindingService } from '../../producer-shelf/abstractions/keyboard-binding.service'
import { BehaviorSubject, Subject, Subscription } from 'rxjs'
import { Injectable } from '@angular/core'
import { KeyBindingService } from '../../keyboard/abstractions/key-binding.service'
import { KeyBinding } from '../../keyboard/models/key-binding'
import { ProducerKeyBindingService } from '../abstractions/producer-key-binding.service'

@Injectable()
export class ProducerKeyboardBindingService implements KeyboardBindingService {
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
    this.producerKeyBindingService.init(rundownId)
    this.producerKeyBindingService.subscribeToKeyBindings().subscribe(keyBindings => this.updateKeyBindings(keyBindings))
    this.keyBindingService.subscribeToKeystrokesOn(document).subscribe(keystrokes => {
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

  public subscribeToKeybindings(callback: (keyBindings: KeyBinding[]) => void): Subscription {
    return this.keyBindingsSubject.subscribe(callback)
  }

  public subscribeToPressedKeys(callback: (pressedKeys: string[]) => void): Subscription {
    return this.keystrokesSubject.subscribe(callback)
  }

  public unsubscribe(): void {
    this.keyBindingService.unsubscribeFromKeystrokes()
  }
}
