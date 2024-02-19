import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MiniShelfComponent } from './mini-shelf.component'
import { ConfigurationService } from '../../../shared/services/configuration.service'
import { anyString, instance, mock, verify, when } from '@typestrong/ts-mockito'
import { ActionStateService } from '../../../shared/services/action-state.service'
import { TimerPipe } from '../../../shared/pipes/timer/timer.pipe'
import { MediaStateService } from '../../../shared/services/media-state.service'
import { ActionService } from '../../../shared/abstractions/action.service'
import { Logger } from '../../../core/abstractions/logger.service'
import { TestEntityFactory } from '../../../test/factories/test-entity.factory'
import { StudioConfiguration } from '../../../shared/models/studio-configuration'
import { Observable } from 'rxjs'
import { Media } from '../../../shared/services/media'
import { Tv2SegmentMetadata } from '../../../core/models/tv2-segment-metadata'

describe('MiniShelfComponent', () => {
  it('should have segment name capitalized as title text', async () => {
    await configureTestBed({
      mockedConfigurationService: createConfigurationService(),
    })

    const fixture: ComponentFixture<MiniShelfComponent> = TestBed.createComponent(MiniShelfComponent)
    const component: MiniShelfComponent = fixture.componentInstance
    const testEntityFactory: TestEntityFactory = new TestEntityFactory()
    const segmentName: string = 'segment-with-video-clip'
    component.segment = testEntityFactory.createSegment({ name: segmentName })
    component.videoClipAction = testEntityFactory.createTv2VideoClipAction()

    fixture.detectChanges()

    const titleElement: HTMLElement = fixture.nativeElement.querySelector('span.c-mini-shelf__title')
    const expectedTitle: string = segmentName.toUpperCase()
    expect(titleElement?.textContent).toBe(expectedTitle)
  })

  it('calculates value of 01:23:45 for given media with duration of 5030000ms', async () => {
    await configureTestBed({
      mockedConfigurationService: createConfigurationService(),
      mockedMediaStateService: createMediaStateService({ duration: 5030000 }),
    })

    const fixture: ComponentFixture<MiniShelfComponent> = TestBed.createComponent(MiniShelfComponent)
    const component: MiniShelfComponent = fixture.componentInstance
    const testEntityFactory: TestEntityFactory = new TestEntityFactory()
    component.segment = testEntityFactory.createSegment({ name: 'media', metadata: createTv2SegmentMetadata() })
    component.videoClipAction = testEntityFactory.createTv2VideoClipAction()

    fixture.detectChanges()

    const durationElement: HTMLElement = fixture.nativeElement.querySelector('span.c-mini-shelf__duration')
    expect(durationElement?.textContent).toEqual('01:23:45')
  })

  it('should have thumbnail with correct url', async () => {
    await configureTestBed({
      mockedConfigurationService: createConfigurationService(),
      mockedMediaStateService: createMediaStateService(),
    })

    const fixture: ComponentFixture<MiniShelfComponent> = TestBed.createComponent(MiniShelfComponent)
    const component: MiniShelfComponent = fixture.componentInstance
    const testEntityFactory: TestEntityFactory = new TestEntityFactory()
    component.segment = testEntityFactory.createSegment({ metadata: { miniShelfVideoClipFile: 'video' } })
    component.videoClipAction = testEntityFactory.createTv2VideoClipAction()

    fixture.detectChanges()

    const thumbnailElement: HTMLElement = fixture.nativeElement.querySelector('img.c-mini-shelf__thumbnail')
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
    const testEntityFactory: TestEntityFactory = new TestEntityFactory()
    component.segment = testEntityFactory.createSegment({ name: 'media', metadata: createTv2SegmentMetadata() })
    component.videoClipAction = testEntityFactory.createTv2VideoClipAction()

    fixture.detectChanges()

    const componentElement: HTMLElement = fixture.nativeElement.querySelector('div.c-mini-shelf')
    componentElement.click()

    verify(actionService.executeAction(anyString(), anyString())).once()
  })

  it('should have red zebra stripes if media is not available', async () => {
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
    const testEntityFactory: TestEntityFactory = new TestEntityFactory()
    component.segment = testEntityFactory.createSegment({ name: 'media-not-available', metadata: createTv2SegmentMetadata() })
    component.videoClipAction = testEntityFactory.createTv2VideoClipAction()

    fixture.detectChanges()

    const componentElement: HTMLElement = fixture.nativeElement.querySelector('div.c-mini-shelf')

    expect(componentElement.classList.contains('unavailable-media')).toBe(true)
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
        const studioConfiguration: StudioConfiguration = new TestEntityFactory().createStudioConfiguration()
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
        observer.next(new TestEntityFactory().createMedia(media))
        observer.complete()
      })
  )
  return mockedMediaStateService
}

async function configureTestBed(
  params: {
    mockedMediaStateService?: MediaStateService
    mockedConfigurationService?: ConfigurationService
    mockedActionStateService?: ActionStateService
    mockedActionService?: ActionService
  } = {}
): Promise<void> {
  const mockedConfigurationService: ConfigurationService = params.mockedConfigurationService ?? mock<ConfigurationService>()
  const mockedActionStateService: ActionStateService = params.mockedActionStateService ?? mock<ActionStateService>()
  const mockedMediaStateService: MediaStateService = params.mockedMediaStateService ?? mock<MediaStateService>()
  const mockedActionService: ActionService = params.mockedActionService ?? mock<ActionService>()
  const mockedLogger: Logger = mock<Logger>()

  await TestBed.configureTestingModule({
    declarations: [MiniShelfComponent, TimerPipe],
    providers: [
      { provide: ConfigurationService, useValue: instance(mockedConfigurationService) },
      { provide: ActionStateService, useValue: instance(mockedActionStateService) },
      { provide: MediaStateService, useValue: instance(mockedMediaStateService) },
      { provide: ActionService, useValue: instance(mockedActionService) },
      { provide: Logger, useValue: instance(mockedLogger) },
    ],
  }).compileComponents()
}
