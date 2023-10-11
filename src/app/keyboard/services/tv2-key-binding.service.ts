import { KeyBindingService } from '../abstractions/key-binding.service'
import { KeyBinding } from '../models/key-binding'
import { BehaviorSubject, fromEvent, Observable, Subject, Subscription } from 'rxjs'
import { KeyBindingMatcher } from '../abstractions/key-binding-matcher.service'
import { Injectable } from '@angular/core'

@Injectable()
export class Tv2KeyBindingService implements KeyBindingService {
  private keystrokes: string[] = []
  private readonly keystrokesSubject: Subject<string[]>
  private keyBindings: KeyBinding[] = []
  private elementSubscriptions?: Subscription[]

  constructor(private readonly keyBindingMatcher: KeyBindingMatcher) {
    this.keystrokesSubject = new BehaviorSubject(this.keystrokes)
  }

  public subscribeToKeystrokesOn(element: EventTarget): Observable<string[]> {
    this.unsubscribeFromKeystrokes()
    this.elementSubscriptions = [
      fromEvent(element, 'keyup').subscribe(event => this.registerKeyRelease(event as KeyboardEvent)),
      fromEvent(element, 'keydown').subscribe(event => this.registerKeyPress(event as KeyboardEvent)),
      fromEvent(element, 'blur').subscribe(() => this.clearKeystrokes()),
    ]
    return this.keystrokesSubject.asObservable()
  }

  private registerKeyRelease(event: KeyboardEvent): void {
    const keyCode: string = event.code
    const shouldPreventDefaultBehaviour: boolean = this.keyBindings.some(keyBinding => this.keyBindingMatcher.shouldPreventDefaultBehaviour(keyBinding, this.keystrokes, true))
    if (shouldPreventDefaultBehaviour) {
      event.preventDefault()
    }
    const matchedKeyBindings: KeyBinding[] = this.keyBindings.filter(keyBinding => this.keyBindingMatcher.isMatching(keyBinding, this.keystrokes, true))
    if (matchedKeyBindings.length === 0) {
      this.deregisterKeystroke(keyCode)
      return
    }
    this.clearKeystrokes()
    matchedKeyBindings.forEach(keyBinding => keyBinding.onMatched())
  }

  private deregisterKeystroke(keystrokeToUnregister: string): void {
    this.keystrokes = this.keystrokes.filter(keystroke => keystroke !== keystrokeToUnregister)
    this.publishKeystrokes()
  }

  private registerKeyPress(event: KeyboardEvent): void {
    if (event.repeat) {
      return
    }
    const keyCode: string = event.code
    this.registerKeystroke(keyCode)
    const shouldPreventDefaultBehaviour: boolean = this.keyBindings.some(keyBinding => this.keyBindingMatcher.shouldPreventDefaultBehaviour(keyBinding, this.keystrokes, false))
    if (shouldPreventDefaultBehaviour) {
      event.preventDefault()
    }
    const matchedKeyBindings: KeyBinding[] = this.keyBindings.filter(keyBinding => this.keyBindingMatcher.isMatching(keyBinding, this.keystrokes, false))
    if (matchedKeyBindings.length === 0) {
      return
    }
    this.clearKeystrokes()
    matchedKeyBindings.forEach(keyBinding => keyBinding.onMatched())
  }

  private registerKeystroke(keystroke: string): void {
    if (this.keystrokes.includes(keystroke)) {
      return
    }
    this.keystrokes = [...this.keystrokes, keystroke]
    this.publishKeystrokes()
  }

  private publishKeystrokes(): void {
    this.keystrokesSubject.next(this.keystrokes)
  }

  private clearKeystrokes(): void {
    this.keystrokes = []
    this.publishKeystrokes()
  }

  public defineKeyBindings(keyBindings: KeyBinding[]): void {
    this.keyBindings = keyBindings
  }

  public unsubscribeFromKeystrokes(): void {
    if (!this.elementSubscriptions) {
      return
    }
    this.elementSubscriptions.forEach(subscription => subscription.unsubscribe())
    this.elementSubscriptions = undefined
  }
}
