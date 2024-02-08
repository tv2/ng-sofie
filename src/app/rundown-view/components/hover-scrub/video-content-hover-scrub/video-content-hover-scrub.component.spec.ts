import { ComponentFixture, TestBed } from '@angular/core/testing'
import { VideoContentHoverScrubComponent } from './video-content-hover-scrub.component'

describe('VideoContentHoverScrubComponent', () => {
  let component: VideoContentHoverScrubComponent
  let fixture: ComponentFixture<VideoContentHoverScrubComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideoContentHoverScrubComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(VideoContentHoverScrubComponent)
    component = fixture.componentInstance
    component.hoverScrubTooltipElementRef = document.createElement('div')
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
