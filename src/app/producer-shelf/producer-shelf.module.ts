import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProducerShelfComponent } from './components/producer-shelf/producer-shelf.component'
import { KeyboardBindingService } from './abstractions/keyboard-binding.service'
import { HardcodedProducerKeyboardBindingService } from './services/hardcoded-producer-keyboard-binding.service'
import { CameraKeyBindingFactory } from './factories/camera-key-binding.factory'
import { SharedModule } from '../shared/shared.module'
import { KeyboardModule } from '../keyboard/keyboard.module'

@NgModule({
  declarations: [ProducerShelfComponent],
  imports: [CommonModule, SharedModule, KeyboardModule],
  providers: [{ provide: KeyboardBindingService, useClass: HardcodedProducerKeyboardBindingService }, CameraKeyBindingFactory],
  exports: [ProducerShelfComponent],
})
export class ProducerShelfModule {}
