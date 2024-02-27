import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, ParamMap, RouterModule } from '@angular/router'
import { RundownStateService } from '../../../core/services/rundown-state.service'
import { anyString, anything, instance, mock, when } from '@typestrong/ts-mockito'
import { Observable, Subscription } from 'rxjs'
import { Logger } from '../../../core/abstractions/logger.service'
import { RundownViewComponent } from './rundown-view.component'
import { KeyboardConfigurationService } from '../../abstractions/keyboard-configuration.service'
import { TestLoggerFactory } from '../../../test/factories/test-logger.factory'
import { Rundown } from '../../../core/models/rundown'
import { ConnectionStatusObserver } from '../../../core/services/connection-status-observer.service'
import { NotificationService } from '../../../shared/services/notification.service'

describe('RundownViewComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(
  params: { rundownStateService?: RundownStateService; keyboardConfigurationService?: KeyboardConfigurationService; connectionStatusObserver?: ConnectionStatusObserver } = {}
): Promise<RundownViewComponent> {
  const mockedRundownStateService: RundownStateService = params.rundownStateService ?? instance(createMockOfRundownStateService())
  const mockedConnectionStatusObserver: ConnectionStatusObserver = params.connectionStatusObserver ?? instance(createMockOfConnectionStatusObserver())
  const mockedKeyboardConfigurationService: KeyboardConfigurationService = params.keyboardConfigurationService ?? instance(mock<KeyboardConfigurationService>())

  const notificationService: NotificationService = mock(NotificationService)
  when(notificationService.subscribeToNotificationPanelIsOpen()).thenReturn(new Observable())

  await TestBed.configureTestingModule({
    imports: [RouterModule.forRoot([])],
    providers: [
      { provide: ActivatedRoute, useValue: instance(createMockOfActivatedRoute()) },
      { provide: RundownStateService, useValue: mockedRundownStateService },
      { provide: ConnectionStatusObserver, useValue: mockedConnectionStatusObserver },
      { provide: KeyboardConfigurationService, useValue: mockedKeyboardConfigurationService },
      { provide: NotificationService, useValue: instance(notificationService) },
      { provide: Logger, useValue: createLogger() },
    ],
    declarations: [RundownViewComponent],
  }).compileComponents()

  const fixture: ComponentFixture<RundownViewComponent> = TestBed.createComponent(RundownViewComponent)
  const component = fixture.componentInstance
  component.ngOnInit()
  return component
}

function createMockOfRundownStateService(): RundownStateService {
  const mockedRundownStateService = mock<RundownStateService>()
  const mockedSubscription = mock<Subscription>()
  const mockedObservable = mock<Observable<Rundown>>()
  when(mockedObservable.subscribe(anything)).thenReturn(instance(mockedSubscription))
  when(mockedRundownStateService.subscribeToRundown(anyString())).thenResolve(instance(mockedObservable))
  return mockedRundownStateService
}

function createMockOfConnectionStatusObserver(): ConnectionStatusObserver {
  return mock<ConnectionStatusObserver>()
}

function createMockOfActivatedRoute(params: { paramMap?: ParamMap } = {}): ActivatedRoute {
  const paramMap: ParamMap = params.paramMap ?? convertToParamMap({ rundownId: 'some-rundown-id' })
  const mockedActivatedRouteSnapshot: ActivatedRouteSnapshot = mock<ActivatedRouteSnapshot>()
  when(mockedActivatedRouteSnapshot.paramMap).thenReturn(paramMap)

  const mockedActivatedRoute: ActivatedRoute = mock<ActivatedRoute>()
  when(mockedActivatedRoute.snapshot).thenReturn(instance(mockedActivatedRouteSnapshot))

  return mockedActivatedRoute
}

function createLogger(): Logger {
  const testLoggerFactory: TestLoggerFactory = new TestLoggerFactory()
  return testLoggerFactory.createLogger()
}
