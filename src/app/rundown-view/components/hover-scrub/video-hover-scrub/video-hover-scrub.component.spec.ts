import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Tv2PieceType } from 'src/app/core/enums/tv2-piece-type'
import { VideoHoverScrubComponent } from './video-hover-scrub.component'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { of } from 'rxjs'
import { TimerPipe } from 'src/app/shared/pipes/timer/timer.pipe'

describe('VideoHoverScrubComponent', () => {
  let component: VideoHoverScrubComponent
  let fixture: ComponentFixture<VideoHoverScrubComponent>
  const mockedConfigurationService: ConfigurationService = mock<ConfigurationService>()

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideoHoverScrubComponent, TimerPipe],
      providers: [{ provide: ConfigurationService, useValue: instance(mockedConfigurationService) }],
    }).compileComponents()

    fixture = TestBed.createComponent(VideoHoverScrubComponent)
    component = fixture.componentInstance
    component.type = Tv2PieceType.VIDEO_CLIP
    component.tooltipHoverMouseEventObservable = of(undefined)
    fixture.detectChanges()
  })
  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
