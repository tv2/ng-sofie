import { KeyboardBindingService } from '../abstractions/keyboard-binding.service'
import { BehaviorSubject, Subject, Subscription } from 'rxjs'
import { Injectable } from '@angular/core'
import { CameraKeyBindingFactory } from '../factories/camera-key-binding.factory'
import { RundownService } from '../../core/abstractions/rundown.service'
import { KeyBindingService } from '../../keyboard/abstractions/key-binding.service'
import { KeyBinding } from '../../keyboard/models/key-binding'
import { KeyBindingMatcher } from '../../keyboard/abstractions/key-binding-matcher.service'

@Injectable()
export class HardcodedProducerKeyboardBindingService implements KeyboardBindingService {
    private readonly keyBindings: KeyBinding[]
    private keystrokes: string[] = []
    private readonly keyBindingsSubject: Subject<KeyBinding[]>
    private readonly keystrokesSubject: Subject<string[]>

    public constructor(
        private readonly keyBindingService: KeyBindingService,
        private readonly keyBindingMatcher: KeyBindingMatcher,
        private readonly cameraKeyBindingFactory: CameraKeyBindingFactory,
        private readonly rundownService: RundownService
    ) {
        this.keyBindings = [
            ...this.getCameraKeyBindings(),
            ...this.getRundownKeyBindings(),
        ]
        this.keyBindingsSubject = new BehaviorSubject(this.keyBindings)
        this.keystrokesSubject = new BehaviorSubject(this.keystrokes)
        this.keyBindingService.subscribeToKeystrokesOn(document).subscribe(keystrokes => {
            this.keystrokes = keystrokes
            this.keystrokesSubject.next(this.keystrokes)
        })
        this.keyBindingService.defineKeyBindings(this.keyBindings)
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
        const defaultKeyBinding: KeyBinding = {
            keys: [''],
            label: '',
            onMatched(): void {},
            shouldMatchOnKeyRelease: false,
            shouldPreventDefaultBehaviourForPartialMatches: false,
            shouldPreventDefaultBehaviourOnKeyPress: false,
            useExclusiveMatching: false,
            useOrderedMatching: false,
        }
        return [
            {
                ...defaultKeyBinding,
                keys: ['Enter'],
                label: 'Take',
                shouldMatchOnKeyRelease: true,
                onMatched: () => this.rundownService.takeNext(rundownId).subscribe()
            },
            {
                ...defaultKeyBinding,
                keys: ['Escape'],
                label: 'Reset Rundown',
                shouldMatchOnKeyRelease: true,
                onMatched: () => this.rundownService.reset(rundownId).subscribe()
            },
            {
                ...defaultKeyBinding,
                keys: ['Backquote'],
                label: 'Activate Rundown',
                shouldMatchOnKeyRelease: true,
                onMatched: () => this.rundownService.activate(rundownId).subscribe()
            },
            {
                ...defaultKeyBinding,
                keys: ['ShiftLeft', 'Backquote'],
                label: 'Deactivate Rundown',
                shouldMatchOnKeyRelease: true,
                onMatched: () => this.rundownService.deactivate(rundownId).subscribe()
            },
        ]
    }

    public subscribeToKeybindings(callback: (keyBindings: KeyBinding[]) => void): Subscription {
        return this.keyBindingsSubject.subscribe(callback)
    }

    public subscribeToPressedKeys(callback: (pressedKeys: string[]) => void): Subscription {
        return this.keystrokesSubject.subscribe(callback)
    }
}
