import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HoverScrubComponent } from './hover-scrub/hover-scrub.component'
import { VideoContentHoverScrubComponent } from './video-content-hover-scrub/video-content-hover-scrub.component'
import { PieceHoverScrubComponent } from './piece-hover-scrub/piece-hover-scrub.component'
import { MiniShelfHoverScrubComponent } from './mini-shelf-hover-scrub/mini-shelf-hover-scrub.component'
import { SharedModule } from 'src/app/shared/shared.module'

@NgModule({
  declarations: [HoverScrubComponent, VideoContentHoverScrubComponent, PieceHoverScrubComponent, MiniShelfHoverScrubComponent],
  imports: [CommonModule, SharedModule],
  exports: [PieceHoverScrubComponent, MiniShelfHoverScrubComponent],
})
export class HoverScrubModule {}
