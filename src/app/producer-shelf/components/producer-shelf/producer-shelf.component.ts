import { Component, Input } from '@angular/core'
import { KeyBinding } from '../../../keyboard/models/key-binding'
import { KeyBindingMatcher } from '../../../keyboard/abstractions/key-binding-matcher.service'

@Component({
  selector: 'sofie-producer-shelf',
  templateUrl: './producer-shelf.component.html',
  styleUrls: ['./producer-shelf.component.scss'],
})
export class ProducerShelfComponent {
  @Input()
  public keyBindings: KeyBinding[]

  @Input()
  public keystrokes: string[]

  constructor(private readonly keyBindingMatcher: KeyBindingMatcher) {}

  public displayKeyBinding(keyBinding: KeyBinding): string {
    return keyBinding.keys.join('+')
  }

  public isKeyBindingMatched(keyBinding: KeyBinding): boolean {
    return this.keyBindingMatcher.isMatching(keyBinding, this.keystrokes, true)
  }
}
