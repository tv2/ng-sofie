import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { KeyBindingEventService } from './abstractions/key-binding-event.service'
import { Tv2KeyBindingEventService } from './services/tv2-key-binding-event.service'
import { KeyBindingMatcher } from './abstractions/key-binding-matcher.service'
import { Tv2KeyBindingMatcher } from './services/tv2-key-binding-matcher.service'
import { KeyAliasService } from './abstractions/key-alias-service'
import { Tv2KeyAliasService } from './services/tv2-key-alias.service'
import { VirtualKeyboardComponent } from './components/virtual-keyboard/virtual-keyboard.component'

@NgModule({
  declarations: [VirtualKeyboardComponent],
  providers: [
    { provide: KeyBindingEventService, useClass: Tv2KeyBindingEventService },
    { provide: KeyBindingMatcher, useClass: Tv2KeyBindingMatcher },
    { provide: KeyAliasService, useClass: Tv2KeyAliasService },
  ],
  imports: [CommonModule],
  exports: [VirtualKeyboardComponent],
})
export class KeyboardModule {}
