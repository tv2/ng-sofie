import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProducerShelfComponent } from './components/producer-shelf/producer-shelf.component'
import { KeyboardBindingService } from './abstractions/keyboard-binding.service'
import { ProducerKeyboardBindingService } from '../rundown/services/producer-keyboard-binding.service'
import { SharedModule } from '../shared/shared.module'
import { KeyboardModule } from '../keyboard/keyboard.module'
import { KeyBindingFactory } from '../rundown/factories/key-binding.factory'

@NgModule({
  declarations: [ProducerShelfComponent],
  imports: [CommonModule, SharedModule, KeyboardModule],
  providers: [{ provide: KeyboardBindingService, useClass: ProducerKeyboardBindingService }, KeyBindingFactory],
  exports: [ProducerShelfComponent],
})
export class ProducerShelfModule {}
