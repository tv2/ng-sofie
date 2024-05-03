import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MiniShelfComponent } from './mini-shelf.component'
import { ConfigurationService } from '../../../shared/services/configuration.service'
import { anyString, instance, mock, verify, when } from '@typestrong/ts-mockito'
import { ActionStateService } from '../../../shared/services/action-state.service'
import { TimerPipe } from '../../../shared/pipes/timer/timer.pipe'
import { MediaStateService } from '../../../shared/services/media-state.service'
import { ActionService } from '../../../shared/abstractions/action.service'
import { Logger } from '../../../core/abstractions/logger.service'
import { RundownStateService } from '../../../core/services/rundown-state.service'
import { RundownEventObserver } from '../../../core/services/rundown-event-observer.service'
import { TestEntityFactory } from '../../../test/factories/test-entity.factory'
import { StudioConfiguration } from '../../../shared/models/studio-configuration'
import { Observable } from 'rxjs'
import { Media } from '../../../shared/services/media'
import { Tv2SegmentMetadata } from '../../../core/models/tv2-segment-metadata'
import { TooltipComponent } from '../../../shared/components/tooltip/tooltip.component'
import { VideoHoverScrubComponent } from '../../../shared/components/video-hover-scrub/video-hover-scrub.component'

describe('MiniShelfComponent', () => {
  it('should have segment name capitalized as title text', async () => {
    await configureTestBed({
      mockedConfigurationService: createConfigurationService(),
    })

    const fixture: ComponentFixture<MiniShelfComponent> = TestBed.createComponent(MiniShelfComponent)
    const component: MiniShelfComponent = fixture.componentInstance

    const segmentName: string = 'segment-with-video-clip'

    component.segment = TestEntityFactory.createSegment({ name: segmentName })

    component.videoClipAction = TestEntityFactory.createTv2VideoClipAction()

    fixture.detectChanges()

    const titleElement: HTMLElement = fixture.nativeElement.querySelector('span.title')

    const expectedTitle: string = segmentName.toUpperCase()

    expect(titleElement?.textContent).toBe(expectedTitle)
  })

  it('calculates value of 01:23:45 for given media with duration of 5030000ms and serverPostrollDuration of 4200ms', async () => {
    await configureTestBed({
      mockedConfigurationService: createConfigurationService(),
      mockedMediaStateService: createMediaStateService({ duration: 5030000 }),
    })

    const fixture: ComponentFixture<MiniShelfComponent> = TestBed.createComponent(MiniShelfComponent)
    const component: MiniShelfComponent = fixture.componentInstance

    component.segment = TestEntityFactory.createSegment({ name: 'media', metadata: createTv2SegmentMetadata() })

    component.videoClipAction = TestEntityFactory.createTv2VideoClipAction()

    fixture.detectChanges()

    const durationElement: HTMLElement = fixture.nativeElement.querySelector('span.duration')

    expect(durationElement?.textContent).toEqual('01:23:45')
  })

  it('calculates value of 00:01 for given media with duration of 5700ms and serverPostrollDuration of 4200ms', async () => {
    await configureTestBed({
      mockedConfigurationService: createConfigurationService(),
      mockedMediaStateService: createMediaStateService({ duration: 5700 }),
    })

    const fixture: ComponentFixture<MiniShelfComponent> = TestBed.createComponent(MiniShelfComponent)
    const component: MiniShelfComponent = fixture.componentInstance

    component.segment = TestEntityFactory.createSegment({ name: 'media', metadata: createTv2SegmentMetadata() })

    component.videoClipAction = TestEntityFactory.createTv2VideoClipAction()

    fixture.detectChanges()

    const durationElement: HTMLElement = fixture.nativeElement.querySelector('span.duration')

    expect(durationElement?.textContent).toEqual('00:01')
  })

  it('calculates value of 00:00 for given media with duration of 1234ms and serverPostrollDuration of 4200ms', async () => {
    await configureTestBed({
      mockedConfigurationService: createConfigurationService(),
      mockedMediaStateService: createMediaStateService({ duration: 1234 }),
    })

    const fixture: ComponentFixture<MiniShelfComponent> = TestBed.createComponent(MiniShelfComponent)
    const component: MiniShelfComponent = fixture.componentInstance

    component.segment = TestEntityFactory.createSegment({ name: 'media', metadata: createTv2SegmentMetadata() })

    component.videoClipAction = TestEntityFactory.createTv2VideoClipAction()

    fixture.detectChanges()

    const durationElement: HTMLElement = fixture.nativeElement.querySelector('span.duration')

    expect(durationElement?.textContent).toEqual('00:00')
  })

  it('should have thumbnail with correct url', async () => {
    await configureTestBed({
      mockedConfigurationService: createConfigurationService(),
      mockedMediaStateService: createMediaStateService(),
    })

    const fixture: ComponentFixture<MiniShelfComponent> = TestBed.createComponent(MiniShelfComponent)
    const component: MiniShelfComponent = fixture.componentInstance

    component.segment = TestEntityFactory.createSegment({ metadata: { miniShelfVideoClipFile: 'video' } })

    component.videoClipAction = TestEntityFactory.createTv2VideoClipAction()

    fixture.detectChanges()

    const thumbnailElement: HTMLElement = fixture.nativeElement.querySelector('img.thumbnail')

    expect(thumbnailElement?.getAttribute('src')).toEqual('http://media.preview.url/media/thumbnail/video')
  })

  it('should execute action when clicked', async () => {
    const actionService: ActionService = createActionService()
    await configureTestBed({
      mockedConfigurationService: createConfigurationService(),
      mockedMediaStateService: createMediaStateService(),
      mockedActionService: actionService,
    })

    const fixture: ComponentFixture<MiniShelfComponent> = TestBed.createComponent(MiniShelfComponent)
    const component: MiniShelfComponent = fixture.componentInstance

    component.segment = TestEntityFactory.createSegment({ name: 'media', metadata: createTv2SegmentMetadata() })

    component.videoClipAction = TestEntityFactory.createTv2VideoClipAction()

    fixture.detectChanges()

    const componentElement: HTMLElement = fixture.nativeElement.querySelector('div.mini-shelf')

    expect(componentElement).toBeTruthy()

    componentElement.click()

    verify(actionService.executeAction(anyString(), anyString())).once()
  })

  it('should have red zebra stripes on thumbnail if media is not available', async () => {
    const actionService: ActionService = createActionService()

    const mockedMediaStateService: MediaStateService = mock<MediaStateService>()
    when(mockedMediaStateService.subscribeToMedia(anyString())).thenCall(
      () =>
        new Observable<Media | undefined>(observer => {
          observer.next(undefined)
          observer.complete()
        })
    )

    await configureTestBed({
      mockedConfigurationService: createConfigurationService(),
      mockedMediaStateService: mockedMediaStateService,
      mockedActionService: actionService,
    })

    const fixture: ComponentFixture<MiniShelfComponent> = TestBed.createComponent(MiniShelfComponent)
    const component: MiniShelfComponent = fixture.componentInstance

    component.segment = TestEntityFactory.createSegment({ name: 'media-not-available', metadata: createTv2SegmentMetadata() })

    component.videoClipAction = TestEntityFactory.createTv2VideoClipAction()

    fixture.detectChanges()

    const thumbnailElement: HTMLImageElement = fixture.nativeElement.querySelector('div.media-unavailable')

    expect(thumbnailElement.classList.contains('media-unavailable')).toBe(true)
  })
})

function createTv2SegmentMetadata(tv2SegmentMetadata: Partial<Tv2SegmentMetadata> = {}): Tv2SegmentMetadata {
  return {
    miniShelfVideoClipFile: 'media',
    ...tv2SegmentMetadata,
  }
}

function createActionService(): ActionService {
  const mockedActionService: ActionService = mock<ActionService>()
  when(mockedActionService.executeAction(anyString(), anyString())).thenCall(() => new Observable())

  return mockedActionService
}

function createConfigurationService(): ConfigurationService {
  const mockedConfigurationService: ConfigurationService = mock<ConfigurationService>()
  when(mockedConfigurationService.getStudioConfiguration()).thenCall(
    () =>
      new Observable<StudioConfiguration>(observer => {
        const studioConfiguration: StudioConfiguration = TestEntityFactory.createStudioConfiguration()
        observer.next(studioConfiguration)
        observer.complete()
      })
  )

  return mockedConfigurationService
}

function createMediaStateService(media: Partial<Media> = {}): MediaStateService {
  const mockedMediaStateService: MediaStateService = mock<MediaStateService>()
  when(mockedMediaStateService.subscribeToMedia(anyString())).thenCall(
    () =>
      new Observable<Media | undefined>(observer => {
        observer.next(TestEntityFactory.createMedia(media))
        observer.complete()
      })
  )

  return mockedMediaStateService
}

function createMockOfRundownStateService(): RundownStateService {
  const mockedRundownStateService: RundownStateService = mock<RundownStateService>()
  when(mockedRundownStateService.subscribeToOnAirPart(anyString())).thenCall(() => new Observable())
  when(mockedRundownStateService.subscribeToNextPart(anyString())).thenCall(() => new Observable())

  return mockedRundownStateService
}

async function configureTestBed(
  params: {
    mockedRundownStateService?: RundownStateService
    mockedMediaStateService?: MediaStateService
    mockedConfigurationService?: ConfigurationService
    mockedActionStateService?: ActionStateService
    mockedActionService?: ActionService
    mockedRundownEventObserver?: RundownEventObserver
  } = {}
): Promise<void> {
  const mockedConfigurationService: ConfigurationService = params.mockedConfigurationService ?? mock<ConfigurationService>()
  const mockedActionStateService: ActionStateService = params.mockedActionStateService ?? mock<ActionStateService>()
  const mockedMediaStateService: MediaStateService = params.mockedMediaStateService ?? mock<MediaStateService>()
  const mockedActionService: ActionService = params.mockedActionService ?? mock<ActionService>()
  const mockedLogger: Logger = mock<Logger>()
  const mockedRundownStateService: RundownStateService = params.mockedRundownStateService ?? createMockOfRundownStateService()
  const mockedRundownEventObserver: RundownEventObserver = params.mockedRundownEventObserver ?? mock<RundownEventObserver>()

  await TestBed.configureTestingModule({
    declarations: [MiniShelfComponent, TimerPipe, TooltipComponent, VideoHoverScrubComponent],
    providers: [
      { provide: ConfigurationService, useValue: instance(mockedConfigurationService) },
      { provide: ActionStateService, useValue: instance(mockedActionStateService) },
      { provide: MediaStateService, useValue: instance(mockedMediaStateService) },
      { provide: ActionService, useValue: instance(mockedActionService) },
      { provide: RundownStateService, useValue: instance(mockedRundownStateService) },
      { provide: Logger, useValue: instance(mockedLogger) },
      { provide: RundownEventObserver, useValue: instance(mockedRundownEventObserver) },
      { provide: TooltipComponent, useValue: mock<TooltipComponent>() },
      { provide: VideoHoverScrubComponent, useValue: mock<VideoHoverScrubComponent>() },
    ],
  }).compileComponents()
}
