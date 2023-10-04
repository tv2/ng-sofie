import { KeyboardBindingService } from '../abstractions/keyboard-binding.service'
import { BehaviorSubject, Subject, Subscription } from 'rxjs'
import { KeyBinding } from '../models/key-binding'
import { KeyboardBindingMatcher } from './keyboard-binding.matcher'
import { Injectable } from '@angular/core'
import { CameraKeyBindingFactory } from '../factories/camera-key-binding.factory'

@Injectable()
export class HardcodedProducerKeyboardBindingService implements KeyboardBindingService {
    private keyBindings: KeyBinding[]
    private pressedKeys: string[] = []
    private readonly keyBindingsSubject: Subject<KeyBinding[]>
    private readonly pressedKeysSubject: Subject<string[]>

    public constructor(
        private readonly keyboardBindingMatcher: KeyboardBindingMatcher,
        private readonly cameraKeyBindingFactory: CameraKeyBindingFactory
    ) {
        this.keyBindings = [
            ...this.getCameraKeyBindings()
        ]
        this.keyBindingsSubject = new BehaviorSubject(this.keyBindings)
        this.pressedKeysSubject = new BehaviorSubject(this.pressedKeys)
        window.addEventListener('keyup', this.onKeyup.bind(this))
        window.addEventListener('keydown', this.onKeydown.bind(this))
        window.addEventListener('blur', () => {
            this.pressedKeys = []
            this.pressedKeysSubject.next(this.pressedKeys)
        })
        // TODO: removeEventListeners when destroyed
    }

    private getCameraKeyBindings(): KeyBinding[] {
        return this.cameraKeyBindingFactory.createCameraKeyBindings(5)
    }

    private onKeyup(event: KeyboardEvent): void {
        this.triggerKeyBindingsOnKeyUp()
        this.deregisterPressedKey(event.key)
    }

    private triggerKeyBindingsOnKeyUp(): void {
        const matchedKeyBindings: KeyBinding[] = this.getMatchedKeyBindings()
        const matchedKeyBindingsOnKeyUp: KeyBinding[] = matchedKeyBindings.filter(keyBinding => !keyBinding.onKeyPress)
        matchedKeyBindingsOnKeyUp.forEach(keyBinding => keyBinding.action())
    }

    private getMatchedKeyBindings(): KeyBinding[] {
        return this.keyBindings.filter(keyBinding => this.keyboardBindingMatcher.isKeyBindingMatchedExactly(keyBinding, this.pressedKeys))
    }

    private deregisterPressedKey(key: string): void {
        if (!this.pressedKeys.includes(key)) {
            return
        }
        this.pressedKeys = this.pressedKeys.filter(pressedKey => pressedKey !== key)
        this.pressedKeysSubject.next(this.pressedKeys)
    }

    private onKeydown(event: KeyboardEvent): void {
        if (event.repeat) {
            return
        }
        this.registerPressedKey(event.key)
    }

    private registerPressedKey(key: string): void {
        if (this.pressedKeys.includes(key)) {
            return
        }
        this.pressedKeys = [...this.pressedKeys, key]
        this.pressedKeysSubject.next(this.pressedKeys)
    }

    public subscribeToKeybindings(callback: (keyBindings: KeyBinding[]) => void): Subscription {
        return this.keyBindingsSubject.subscribe(callback)
    }

    public subscribeToPressedKeys(callback: (pressedKeys: string[]) => void): Subscription {
        return this.pressedKeysSubject.subscribe(callback)
    }
}
