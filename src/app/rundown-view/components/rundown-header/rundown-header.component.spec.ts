import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RundownHeaderComponent } from './rundown-header.component'
import { ShowStyleVariantStateService } from '../../../core/services/show-style-variant-state.service'
import { anyString, anything, instance, mock, when } from '@typestrong/ts-mockito'
import { RouterModule } from '@angular/router'
import { Observable, Subscription } from 'rxjs'
import { Rundown } from '../../../core/models/rundown'
import { Logger } from '../../../core/abstractions/logger.service'
import { TestLoggerFactory } from '../../../test/factories/test-logger.factory'
import { RundownTimingService } from '../../../core/services/rundown-timing.service'
import { TimerPipe } from '../../pipes/timer/timer.pipe'
import { ShowStyleVariant } from '../../../core/models/show-style-variant'

describe('RundownHeaderComponent', () => {
  it('should create', async () => {
    const mockedRundown: Rundown = getMockedRundown()
    const component: RundownHeaderComponent = await configureTestBed()
    component.rundown = instance(mockedRundown)
    component.ngOnInit()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(params: { mockedShowStyleVariantStateService?: ShowStyleVariantStateService } = {}): Promise<RundownHeaderComponent> {
  const mockedShowStyleVariantStateService = params.mockedShowStyleVariantStateService ?? createMockOfShowStyleVariantStateService()
  await TestBed.configureTestingModule({
    imports: [RouterModule.forRoot([])],
    providers: [
      { provide: ShowStyleVariantStateService, useValue: instance(mockedShowStyleVariantStateService) },
      { provide: RundownTimingService, useValue: instance(mock<RundownTimingService>()) },
      { provide: Logger, useValue: createLogger() },
    ],
    declarations: [RundownHeaderComponent, TimerPipe],
  }).compileComponents()
  const fixture: ComponentFixture<RundownHeaderComponent> = TestBed.createComponent(RundownHeaderComponent)
  return fixture.componentInstance
}

function createMockOfShowStyleVariantStateService(): ShowStyleVariantStateService {
  const mockedShowStyleVariantStateService: ShowStyleVariantStateService = mock<ShowStyleVariantStateService>()
  const mockedSubscription: Subscription = mock<Subscription>()
  const mockedObservable: Observable<ShowStyleVariant> = mock<Observable<ShowStyleVariant>>()
  when(mockedObservable.subscribe(anything())).thenReturn(instance(mockedSubscription))
  when(mockedShowStyleVariantStateService.subscribeToShowStyleVariant(anyString())).thenResolve(instance(mockedObservable))
  return mockedShowStyleVariantStateService
}

function getMockedRundown(): Rundown {
  const mockedRundown = mock<Rundown>()
  when(mockedRundown.id).thenReturn('some-part-id')
  when(mockedRundown.name).thenReturn('my.rundown.name')
  return mockedRundown
}

function createLogger(): Logger {
  const testLoggerFactory: TestLoggerFactory = new TestLoggerFactory()
  return testLoggerFactory.createLogger()
}
