import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, ParamMap, RouterModule } from '@angular/router'
import { RundownStateService } from '../../../core/services/rundown-state.service'
import { anyString, anything, instance, mock, when } from '@typestrong/ts-mockito'
import { Subscription } from 'rxjs'
import { Logger } from '../../../core/abstractions/logger.service'
import { RundownViewComponent } from './rundown-view.component'

describe('RundownViewComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(params: { mockedRundownStateService?: RundownStateService } = {}): Promise<RundownViewComponent> {
  const mockedRundownStateService = params.mockedRundownStateService ?? createMockOfRundownStateService()

  await TestBed.configureTestingModule({
    imports: [RouterModule.forRoot([])],
    providers: [
      { provide: ActivatedRoute, useValue: instance(createMockOfActivatedRoute()) },
      { provide: RundownStateService, useValue: instance(mockedRundownStateService) },
      { provide: Logger, useValue: instance(createMockOfLogger()) },
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
  when(mockedRundownStateService.subscribeToRundown(anyString(), anything())).thenResolve(instance(mockedSubscription))
  return mockedRundownStateService
}

function createMockOfActivatedRoute(params: { paramMap?: ParamMap } = {}): ActivatedRoute {
  const paramMap: ParamMap = params.paramMap ?? convertToParamMap({ rundownId: 'some-rundown-id' })
  const mockedActivatedRouteSnapshot: ActivatedRouteSnapshot = mock<ActivatedRouteSnapshot>()
  when(mockedActivatedRouteSnapshot.paramMap).thenReturn(paramMap)

  const mockedActivatedRoute: ActivatedRoute = mock<ActivatedRoute>()
  when(mockedActivatedRoute.snapshot).thenReturn(instance(mockedActivatedRouteSnapshot))

  return mockedActivatedRoute
}

// TODO: Extract to one place
function createMockOfLogger(): Logger {
  const mockedLogger: Logger = mock<Logger>()
  when(mockedLogger.tag(anyString())).thenCall(() => instance(createMockOfLogger()))
  when(mockedLogger.data(anything())).thenCall(() => instance(createMockOfLogger()))
  when(mockedLogger.metadata(anything())).thenCall(() => instance(createMockOfLogger()))
  return mockedLogger
}
