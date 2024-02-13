import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Tv2PieceType } from 'src/app/core/enums/tv2-piece-type'
import { HEIGHT_FOR_VIDEO_CONTENT_IN_PX, WIDTH_FOR_VIDEO_CONTENT_IN_PX } from '../hover-scrub/hover-scrub.component'
import { UnavailableVideoHoverScrubComponent } from './unavailable-video-hover-scrub.component'

describe('UnavailableVideoHoverScrubComponent', () => {
  let component: UnavailableVideoHoverScrubComponent
  let fixture: ComponentFixture<UnavailableVideoHoverScrubComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnavailableVideoHoverScrubComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(UnavailableVideoHoverScrubComponent)
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
