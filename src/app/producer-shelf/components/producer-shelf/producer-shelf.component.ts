import { Component } from '@angular/core'
import { KeyboardBindingService } from '../../abstractions/keyboard-binding.service'
import { KeyBinding } from '../../models/key-binding'
import { KeyboardBindingMatcher } from '../../services/keyboard-binding.matcher'

@Component({
  selector: 'sofie-producer-shelf',
  templateUrl: './producer-shelf.component.html',
  styleUrls: ['./producer-shelf.component.scss'],
})
export class ProducerShelfComponent {
  public keyBindings: KeyBinding[] = []
  public pressedKeys: string[] = []

  constructor(
    private readonly keyboardBindingService: KeyboardBindingService,
    private readonly keyboardBindingMatcher: KeyboardBindingMatcher
  ) {
    // TODO: handle closing subscriptions on teardown
    this.keyboardBindingService.subscribeToKeybindings((keyBindings: KeyBinding[]) => (this.keyBindings = keyBindings))
    this.keyboardBindingService.subscribeToPressedKeys((pressedKeys: string[]) => (this.pressedKeys = pressedKeys))
  }

  public displayKeyBinding(keyBinding: KeyBinding): string {
    return [...keyBinding.modifiers, keyBinding.key].join('+')
  }

  public isKeyBindingMatched(keyBinding: KeyBinding): boolean {
    return this.keyboardBindingMatcher.isKeyBindingMatchedExactly(keyBinding, this.pressedKeys)
  }
}
