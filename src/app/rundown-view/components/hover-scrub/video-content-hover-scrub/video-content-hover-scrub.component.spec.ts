import { ComponentFixture, TestBed } from '@angular/core/testing'
import { VideoContentHoverScrubComponent } from './video-content-hover-scrub.component'
import { Tv2PieceType } from 'src/app/core/enums/tv2-piece-type'
import { HEIGHT_FOR_VIDEO_CONTENT_IN_PX, WIDTH_FOR_VIDEO_CONTENT_IN_PX } from '../hover-scrub/hover-scrub.component'

describe('VideoContentHoverScrubComponent', () => {
  let component: VideoContentHoverScrubComponent
  let fixture: ComponentFixture<VideoContentHoverScrubComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideoContentHoverScrubComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(VideoContentHoverScrubComponent)
    component = fixture.componentInstance
    component.hoverScrubTooltipElemen = document.createElement('div')
    component.type = Tv2PieceType.VIDEO_CLIP
    component.hoverScrubElementSize = { height: HEIGHT_FOR_VIDEO_CONTENT_IN_PX, width: WIDTH_FOR_VIDEO_CONTENT_IN_PX }
    fixture.detectChanges()
  })
  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
