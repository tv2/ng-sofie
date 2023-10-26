import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { KeyBindingEventService } from './abstractions/key-binding-event.service'
import { Tv2KeyBindingEventService } from './services/tv2-key-binding-event.service'
import { KeyBindingMatcher } from './abstractions/key-binding-matcher.service'
import { Tv2KeyBindingMatcher } from './services/tv2-key-binding-matcher.service'
import { KeyAliasService } from './abstractions/key-alias-service'
import { Tv2KeyAliasService } from './services/tv2-key-alias.service'
import { VirtualKeyboardComponent } from './components/virtual-keyboard/virtual-keyboard.component'
import { VirtualKeyboardKeyComponent } from './components/virtual-keyboard-key/virtual-keyboard-key.component'
import { PhysicalKeyboardLayoutService } from './abstractions/physical-keyboard-layout.service'
import { Iso102PhysicalKeyboardLayoutService } from './services/iso-102-physical-keyboard-layout.service'
import { KeyboardKeyLabelService } from './abstractions/keyboard-key-label.service'
import { Tv2KeyboardKeyLabelService } from './services/tv2-keyboard-key-label.service'

@NgModule({
  declarations: [VirtualKeyboardComponent, VirtualKeyboardKeyComponent],
  providers: [
    { provide: KeyBindingEventService, useClass: Tv2KeyBindingEventService },
    { provide: KeyBindingMatcher, useClass: Tv2KeyBindingMatcher },
    { provide: KeyAliasService, useClass: Tv2KeyAliasService },
    { provide: PhysicalKeyboardLayoutService, useClass: Iso102PhysicalKeyboardLayoutService },
    { provide: KeyboardKeyLabelService, useClass: Tv2KeyboardKeyLabelService },
  ],
  imports: [CommonModule],
  exports: [VirtualKeyboardComponent],
})
export class KeyboardModule {}
