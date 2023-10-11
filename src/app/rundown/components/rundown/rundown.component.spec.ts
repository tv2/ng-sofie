import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RundownComponent } from './rundown.component'
import { anyString, anything, instance, mock, when } from '@typestrong/ts-mockito'
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, ParamMap, RouterModule } from '@angular/router'
import { RundownStateService } from '../../../core/services/rundown-state.service'
import { Subscription } from 'rxjs'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { DialogService } from '../../../shared/services/dialog.service'
import { Logger } from '../../../core/abstractions/logger.service'

describe('RundownComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(
  params: { mockedRundownService?: RundownService; mockedRundownStateService?: RundownStateService; mockedDialogService?: DialogService } = {}
): Promise<RundownComponent> {
  const mockedRundownService = params.mockedRundownService ?? mock<RundownService>()
  const mockedDialogService = params.mockedDialogService ?? mock<DialogService>()
  const mockedRundownStateService = params.mockedRundownStateService ?? createMockOfRundownStateService()

  await TestBed.configureTestingModule({
    imports: [RouterModule.forRoot([])],
    providers: [
      { provide: ActivatedRoute, useValue: instance(createMockOfActivatedRoute()) },
      { provide: RundownService, useValue: instance(mockedRundownService) },
      { provide: RundownStateService, useValue: instance(mockedRundownStateService) },
      { provide: DialogService, useValue: instance(mockedDialogService) },
      { provide: Logger, useValue: instance(createMockOfLogger()) },
    ],
    declarations: [RundownComponent],
  }).compileComponents()

  const fixture: ComponentFixture<RundownComponent> = TestBed.createComponent(RundownComponent)
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
