import { NgModule } from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { ProducerShelfComponent } from './components/producer-shelf/producer-shelf.component'
import { SharedModule } from '../shared/shared.module'
import { KeyboardModule } from '../keyboard/keyboard.module'
import { Tv2ActionPanelComponent } from './components/tv2-action-panel/tv2-action-panel.component'
import { Tv2ActionCardComponent } from './components/tv2-action-card/tv2-action-card.component'

@NgModule({
  declarations: [ProducerShelfComponent, Tv2ActionPanelComponent, Tv2ActionCardComponent],
  imports: [CommonModule, SharedModule, KeyboardModule, NgOptimizedImage],
  exports: [ProducerShelfComponent, Tv2ActionCardComponent],
})
export class ProducerShelfModule {}
