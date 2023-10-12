import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProducerShelfComponent } from './components/producer-shelf/producer-shelf.component'
import { SharedModule } from '../shared/shared.module'

@NgModule({
  declarations: [ProducerShelfComponent],
  imports: [CommonModule, SharedModule],
  providers: [],
  exports: [ProducerShelfComponent],
})
export class ProducerShelfModule {}
