import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RundownComponent } from './rundown.component'
import { anyString, anything, instance, mock, verify, when } from '@typestrong/ts-mockito'
import { RundownStateService } from '../../../core/services/rundown-state.service'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { DialogService } from '../../../shared/services/dialog.service'
import { RundownTimingContextStateService } from '../../../core/services/rundown-timing-context-state.service'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { Logger } from '../../../core/abstractions/logger.service'
import { RundownEventObserver } from 'src/app/core/services/rundown-event-observer.service'
import { ActionStateService } from '../../../shared/services/action-state.service'
import { EntityParser } from '../../../core/abstractions/entity-parser.service'
import { Observable, Subscription } from 'rxjs'
import { TestEntityFactory } from '../../../test/factories/test-entity.factory'
import { Rundown } from '../../../core/models/rundown'
import { Action } from '../../../shared/models/action'
import { TestLoggerFactory } from '../../../test/factories/test-logger.factory'
import { RundownTimingContext } from '../../../core/models/rundown-timing-context'

let fixture: ComponentFixture<RundownComponent>
describe('RundownComponent', () => {
  it('should subscribe to RundownTimingContext changes upon init', async () => {
    const mockedRundownTimingContextStateService: RundownTimingContextStateService = createMockOfRundownTimingContextStateService()

    const mockedRundown: Rundown = new TestEntityFactory().createRundown()

    await configureTestBed({
      mockedRundown: mockedRundown,
      mockedRundownTimingContextStateService: mockedRundownTimingContextStateService,
    })

    verify(mockedRundownTimingContextStateService.subscribeToRundownTimingContext(mockedRundown.id)).once()
  })

  it('should subscribe to RundownActions changes upon init', async () => {
    const mockedActionStateService: ActionStateService = createMockOfActionStateService()

    const mockedRundown: Rundown = new TestEntityFactory().createRundown()

    await configureTestBed({
      mockedRundown: mockedRundown,
      mockedActionStateService: mockedActionStateService,
    })

    verify(mockedActionStateService.subscribeToRundownActions(mockedRundown.id)).once()
  })

  it('should subscribe to RundownDeactivation changes upon init', async () => {
    const mockedRundownEventObserver: RundownEventObserver = createMockOfRundownEventObserver()

    await configureTestBed({
      mockedRundownEventObserver: mockedRundownEventObserver,
    })

    verify(mockedRundownEventObserver.subscribeToRundownDeactivation(anything())).once()
  })

  it('should subscribe to RundownAutoNext changes upon init', async () => {
    const mockedRundownEventObserver: RundownEventObserver = createMockOfRundownEventObserver()

    await configureTestBed({
      mockedRundownEventObserver: mockedRundownEventObserver,
    })

    verify(mockedRundownEventObserver.subscribeToRundownAutoNext(anything())).once()
  })

  it('should subscribe to RundownSetNext changes upon init', async () => {
    const mockedRundownEventObserver: RundownEventObserver = createMockOfRundownEventObserver()

    await configureTestBed({
      mockedRundownEventObserver: mockedRundownEventObserver,
    })

    verify(mockedRundownEventObserver.subscribeToRundownSetNext(anything())).once()
  })

  it('should subscribe to RundownReset changes upon init', async () => {
    const mockedRundownEventObserver: RundownEventObserver = createMockOfRundownEventObserver()

    await configureTestBed({
      mockedRundownEventObserver: mockedRundownEventObserver,
    })

    verify(mockedRundownEventObserver.subscribeToRundownReset(anything())).once()
  })
})

async function configureTestBed(
  params: {
    mockedRundownService?: RundownService
    mockedRundownStateService?: RundownStateService
    mockedDialogService?: DialogService
    mockedRundownEventObserver?: RundownEventObserver
    mockedRundownTimingContextStateService?: RundownTimingContextStateService
    mockedActionStateService?: ActionStateService
    mockedEntityParser?: EntityParser
    mockedRundown?: Rundown
  } = {}
): Promise<RundownComponent> {
  const mockedRundownService: RundownService = params.mockedRundownService ?? mock<RundownService>()
  const mockedRundownEventObserver: RundownEventObserver = params.mockedRundownEventObserver ?? createMockOfRundownEventObserver()
  const mockedDialogService: DialogService = params.mockedDialogService ?? mock<DialogService>()
  const mockedRundownTimingContextStateService: RundownTimingContextStateService = params.mockedRundownTimingContextStateService ?? createMockOfRundownTimingContextStateService()
  const mockedActionStateService: ActionStateService = params.mockedActionStateService ?? createMockOfActionStateService()
  const mockedEntityParser: EntityParser = params.mockedEntityParser ?? mock<EntityParser>()

  await TestBed.configureTestingModule({
    providers: [
      { provide: RundownService, useValue: instance(mockedRundownService) },
      { provide: DialogService, useValue: instance(mockedDialogService) },
      { provide: RundownEventObserver, useValue: instance(mockedRundownEventObserver) },
      { provide: PartEntityService, useValue: instance(mock<PartEntityService>()) },
      { provide: RundownTimingContextStateService, useValue: instance(mockedRundownTimingContextStateService) },
      { provide: Logger, useValue: new TestLoggerFactory().createLogger() },
      { provide: ActionStateService, useValue: instance(mockedActionStateService) },
      { provide: EntityParser, useValue: instance(mockedEntityParser) },
    ],
    declarations: [RundownComponent],
  }).compileComponents()

  fixture = TestBed.createComponent(RundownComponent)

  const component: RundownComponent = fixture.componentInstance

  component.rundown = params.mockedRundown ?? new TestEntityFactory().createRundown()

  fixture.detectChanges()

  return component
}

function createMockOfRundownTimingContextStateService(): RundownTimingContextStateService {
  const mockedRundownTimingContextStateService: RundownTimingContextStateService = mock<RundownTimingContextStateService>()
  when(mockedRundownTimingContextStateService.subscribeToRundownTimingContext(anyString())).thenCall(() => Promise.resolve(new Observable<RundownTimingContext>()))

  return mockedRundownTimingContextStateService
}

function createMockOfActionStateService(): ActionStateService {
  const mockedActionStateService: ActionStateService = mock<ActionStateService>()
  when(mockedActionStateService.subscribeToRundownActions(anyString())).thenResolve(new Observable<Action[]>())

  return mockedActionStateService
}

function createMockOfRundownEventObserver(): RundownEventObserver {
  const mockedRundownEventObserver: RundownEventObserver = mock<RundownEventObserver>()
  when(mockedRundownEventObserver.subscribeToRundownActivation(anyString())).thenCall(() => new Subscription())
  when(mockedRundownEventObserver.subscribeToRundownDeactivation(anything())).thenCall(() => new Subscription())
  when(mockedRundownEventObserver.subscribeToRundownAutoNext(anything())).thenCall(() => new Subscription())
  when(mockedRundownEventObserver.subscribeToRundownSetNext(anything())).thenCall(() => new Subscription())
  when(mockedRundownEventObserver.subscribeToRundownReset(anything())).thenCall(() => new Subscription())
  when(mockedRundownEventObserver.subscribeToRundownUpdates(anything())).thenCall(() => new Subscription())

  return mockedRundownEventObserver
}
