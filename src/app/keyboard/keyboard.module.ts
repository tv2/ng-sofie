import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { KeyBindingService } from './abstractions/key-binding.service'
import { Tv2KeyBindingService } from './services/tv2-key-binding.service'
import { KeyBindingMatcher } from './abstractions/key-binding-matcher.service'
import { Tv2KeyBindingMatcher } from './services/tv2-key-binding-matcher.service'

@NgModule({
  declarations: [],
  providers: [
    { provide: KeyBindingService, useClass: Tv2KeyBindingService },
    { provide: KeyBindingMatcher, useClass: Tv2KeyBindingMatcher },
  ],
  imports: [CommonModule],
})
export class KeyboardModule {}
