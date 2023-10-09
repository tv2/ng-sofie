import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProducerShelfComponent } from './components/producer-shelf/producer-shelf.component'
import { KeyboardBindingService } from './abstractions/keyboard-binding.service'
import { HardcodedProducerKeyboardBindingService } from './services/hardcoded-producer-keyboard-binding.service'
import { KeyboardBindingMatcher } from './services/keyboard-binding.matcher'
import { CameraKeyBindingFactory } from './factories/camera-key-binding.factory'
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [ProducerShelfComponent],
    imports: [CommonModule, SharedModule],
  providers: [
    { provide: KeyboardBindingService, useClass: HardcodedProducerKeyboardBindingService },
    KeyboardBindingMatcher,
    CameraKeyBindingFactory,
  ],
  exports: [
    ProducerShelfComponent
  ]
})
export class ProducerShelfModule {}
