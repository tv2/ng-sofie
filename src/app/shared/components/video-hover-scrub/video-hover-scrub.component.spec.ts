import { ComponentFixture, TestBed } from '@angular/core/testing'
import { VideoHoverScrubComponent } from './video-hover-scrub.component'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'
import { instance, mock, when } from '@typestrong/ts-mockito'
import { Observable, of } from 'rxjs'
import { TimerPipe } from 'src/app/shared/pipes/timer/timer.pipe'
import { StudioConfiguration } from 'src/app/shared/models/studio-configuration'

describe('VideoHoverScrubComponent', () => {
  let component: VideoHoverScrubComponent
  let fixture: ComponentFixture<VideoHoverScrubComponent>
  const mockedConfigurationService: ConfigurationService = instance(createMockOfConfigurationService())

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideoHoverScrubComponent, TimerPipe],
      providers: [{ provide: ConfigurationService, useValue: mockedConfigurationService }],
    }).compileComponents()

    fixture = TestBed.createComponent(VideoHoverScrubComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })
  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

function createMockOfConfigurationService(): ConfigurationService {
  const mockedConfigurationService = mock<ConfigurationService>()
  const mockedObservable: Observable<StudioConfiguration> = of({ settings: { mediaPreviewUrl: '' }, blueprintConfiguration: { ServerPostrollDuration: 0 } })
  when(mockedConfigurationService.getStudioConfiguration()).thenReturn(mockedObservable)
  return mockedConfigurationService
}
