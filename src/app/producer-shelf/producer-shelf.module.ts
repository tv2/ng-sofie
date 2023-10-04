import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { KeyboardBindingService } from './abstractions/keyboard-binding.service'
import { HardcodedProducerKeyboardBindingService } from './services/hardcoded-producer-keyboard-binding.service'
import { KeyboardBindingMatcher } from './services/keyboard-binding.matcher'
import { CameraKeyBindingFactory } from './factories/camera-key-binding.factory'

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    { provide: KeyboardBindingService, useClass: HardcodedProducerKeyboardBindingService },
    KeyboardBindingMatcher,
    CameraKeyBindingFactory,
  ],
  exports: [
  ]
})
export class ProducerShelfModule {}
