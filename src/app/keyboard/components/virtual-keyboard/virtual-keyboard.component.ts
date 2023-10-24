import { Component, Input } from '@angular/core'
import { KeyBinding } from '../../models/key-binding'
import { KeyBindingMatcher } from '../../abstractions/key-binding-matcher.service'
import { KeyEventType } from '../../value-objects/key-event-type'

@Component({
  selector: 'sofie-virtual-keyboard',
  templateUrl: './virtual-keyboard.component.html',
  styleUrls: ['./virtual-keyboard.component.scss'],
})
export class VirtualKeyboardComponent {
  @Input()
  public keyBindings: KeyBinding[]

  @Input()
  public keystrokes: string[]

  constructor(private readonly keyBindingMatcher: KeyBindingMatcher) {}

  public displayKeyBinding(keyBinding: KeyBinding): string {
    return keyBinding.keys.map(key => this.displayKey(key)).join(' + ')
  }

  private displayKey(key: string): string {
    return key.replace('Digit', '').replace('Key', '').replace('Left', '').replace('Right', '')
  }

  public isKeyBindingMatched(keyBinding: KeyBinding): boolean {
    return this.keyBindingMatcher.isMatching(keyBinding, this.keystrokes, KeyEventType.RELEASED)
  }
}
