import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProducerShelfComponent } from './components/producer-shelf/producer-shelf.component'
import { SharedModule } from '../shared/shared.module'
import { KeyboardModule } from '../keyboard/keyboard.module';

@NgModule({
  declarations: [ProducerShelfComponent, ],
  imports: [CommonModule, SharedModule, KeyboardModule],
  exports: [ProducerShelfComponent],
})
export class ProducerShelfModule {}
