import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PieceHoverScrubComponent } from './piece-hover-scrub/piece-hover-scrub.component'
import { MiniShelfHoverScrubComponent } from './mini-shelf-hover-scrub/mini-shelf-hover-scrub.component'
import { SharedModule } from 'src/app/shared/shared.module'
import { VideoHoverScrubComponent } from './video-hover-scrub/video-hover-scrub.component'

@NgModule({
  declarations: [VideoHoverScrubComponent, PieceHoverScrubComponent, MiniShelfHoverScrubComponent],
  imports: [CommonModule, SharedModule],
  exports: [PieceHoverScrubComponent, MiniShelfHoverScrubComponent],
})
export class HoverScrubModule {}
