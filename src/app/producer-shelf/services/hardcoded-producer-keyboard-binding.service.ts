import { KeyboardBindingService } from '../abstractions/keyboard-binding.service'
import { BehaviorSubject, fromEvent, Subject, Subscription } from 'rxjs'
import { KeyBinding } from '../models/key-binding'
import { KeyboardBindingMatcher } from './keyboard-binding.matcher'
import { HostListener, Injectable, OnDestroy } from '@angular/core'
import { CameraKeyBindingFactory } from '../factories/camera-key-binding.factory'
import { RundownService } from '../../core/abstractions/rundown.service'

@Injectable()
export class HardcodedProducerKeyboardBindingService implements KeyboardBindingService, OnDestroy {
    private keyBindings: KeyBinding[]
    private pressedKeys: string[] = []
    private readonly keyBindingsSubject: Subject<KeyBinding[]>
    private readonly pressedKeysSubject: Subject<string[]>
    private readonly windowSubscriptions: Subscription[]

    public constructor(
        private readonly keyboardBindingMatcher: KeyboardBindingMatcher,
        private readonly cameraKeyBindingFactory: CameraKeyBindingFactory,
        private readonly rundownService: RundownService
    ) {
        this.keyBindings = [
            ...this.getCameraKeyBindings(),
            ...this.getRundownKeyBindings(),
        ]
        // TODO: unsubscribe when destroyed
        this.windowSubscriptions = [
            fromEvent(window, 'keyup').subscribe(event => this.onKeyup(event as KeyboardEvent)),
            fromEvent(window, 'keydown').subscribe(event => this.onKeydown(event as KeyboardEvent)),
            fromEvent(window, 'blur').subscribe(() => this.resetPressedKeys()),
        ]
        this.keyBindingsSubject = new BehaviorSubject(this.keyBindings)
        this.pressedKeysSubject = new BehaviorSubject(this.pressedKeys)
    }

    private getCameraKeyBindings(): KeyBinding[] {
        return this.cameraKeyBindingFactory.createCameraKeyBindings(5)
    }

    private getRundownKeyBindings(): KeyBinding[] {
        // TODO: Don't take it directly from URL
        const { rundownId } = window.location.pathname.match(/rundowns\/(?<rundownId>.+)\/?/)?.groups ?? {}
        if (!rundownId) {
            throw new Error('Failed getting rundown id.')
        }
        return [
            {
                key: 'Enter',
                modifiers: [],
                label: 'Take',
                onKeyPress: false,
                action: () => this.rundownService.takeNext(rundownId).subscribe()
            },
            {
                key: 'Escape',
                modifiers: [],
                label: 'Reset Rundown',
                onKeyPress: false,
                action: () => this.rundownService.reset(rundownId).subscribe()
            },
            {
                key: 'Backquote',
                modifiers: [],
                label: 'Activate Rundown',
                onKeyPress: false,
                action: () => this.rundownService.activate(rundownId).subscribe()
            },
            {
                key: 'Backquote',
                modifiers: ['ShiftLeft'],
                label: 'Deactivate Rundown',
                onKeyPress: false,
                action: () => this.rundownService.deactivate(rundownId).subscribe()
            },
        ]
    }

    @HostListener('document:blur', ['$event'])
    private resetPressedKeys(): void {
        this.pressedKeys = []
        this.pressedKeysSubject.next(this.pressedKeys)
    }

    @HostListener('document:keyup', ['$event'])
    private onKeyup(event: KeyboardEvent): void {
        const keyBindings: KeyBinding[] = this.getKeyBindingsOnKeyUp()
        this.deregisterPressedKey(event.code)
        if (keyBindings.length === 0) {
            return
        }
        event.preventDefault()
        keyBindings.forEach(keyBinding => keyBinding.action())
        this.resetPressedKeys()
    }

    private getKeyBindingsOnKeyUp(): KeyBinding[] {
        return this.getMatchedKeyBindings().filter(keyBinding => !keyBinding.onKeyPress)
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

    @HostListener('document:keydown', ['$event'])
    private onKeydown(event: KeyboardEvent): void {
        if (event.repeat) {
            return
        }
        this.registerPressedKey(event.code)
        const keyBindings: KeyBinding[] = this.getKeyBindingsOnKeyPress()
        if(keyBindings.length === 0) {
            return
        }
        keyBindings.forEach(keyBinding => keyBinding.action())
        event.preventDefault()
        this.resetPressedKeys()
    }

    private registerPressedKey(key: string): void {
        if (this.pressedKeys.includes(key)) {
            return
        }
        this.pressedKeys = [...this.pressedKeys, key]
        this.pressedKeysSubject.next(this.pressedKeys)
    }

    private getKeyBindingsOnKeyPress(): KeyBinding[] {
        return this.getMatchedKeyBindings().filter(keyBinding => keyBinding.onKeyPress)
    }

    public subscribeToKeybindings(callback: (keyBindings: KeyBinding[]) => void): Subscription {
        return this.keyBindingsSubject.subscribe(callback)
    }

    public subscribeToPressedKeys(callback: (pressedKeys: string[]) => void): Subscription {
        return this.pressedKeysSubject.subscribe(callback)
    }

    public ngOnDestroy(): void {
        this.windowSubscriptions.forEach(subscription => subscription.unsubscribe())
    }
}
