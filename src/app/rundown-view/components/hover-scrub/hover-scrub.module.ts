import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HoverScrubComponent } from './hover-scrub/hover-scrub.component'
import { VideoContentHoverScrubComponent } from './video-content-hover-scrub/video-content-hover-scrub.component'

@NgModule({
  declarations: [HoverScrubComponent, VideoContentHoverScrubComponent],
  imports: [CommonModule],
  exports: [HoverScrubComponent],
})
export class HoverScrubModule {}
