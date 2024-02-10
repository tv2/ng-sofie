import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RundownComponent } from './rundown.component'
import { anything, instance, mock, verify, when } from '@typestrong/ts-mockito'
import { RundownStateService } from '../../../core/services/rundown-state.service'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { DialogService } from '../../../shared/services/dialog.service'
import { RundownTimingContextStateService } from '../../../core/services/rundown-timing-context-state.service'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { Logger } from '../../../core/abstractions/logger.service'
import { RundownEventObserver } from 'src/app/core/services/rundown-event-observer.service'
import { ActionStateService } from '../../../shared/services/action-state.service'
import { EntityParser } from '../../../core/abstractions/entity-parser.service'
import { MiniShelfStateService } from '../../services/mini-shelf-state.service'
import { Observable, Subscription } from 'rxjs'
import { TestEntityFactory } from '../../../test/factories/test-entity.factory'
import { RundownTimingContext } from '../../../core/models/rundown-timing-context'
import { Rundown } from '../../../core/models/rundown'
import { Action } from '../../../shared/models/action'

describe('RundownComponent', () => {
  it('should create and receive rundown, then updates MiniShelves and subscribes several times', async () => {
    const mockedMiniShelfStateService: MiniShelfStateService = createMockOfMiniShelfStateService()
    const mockedRundownTimingContextStateService: RundownTimingContextStateService = createMockOfRundownTimingContextStateService()
    const mockedActionStateService: ActionStateService = createMockOfActionStateService()
    const mockedRundownEventObserver: RundownEventObserver = createMockOfRundownEventObserver()

    const mockedRundown: Rundown = new TestEntityFactory().createRundown()
    const component: RundownComponent = await configureTestBed({
      mockedRundown: mockedRundown,
      mockedRundownEventObserver: mockedRundownEventObserver,
      mockedMiniShelfStateService: mockedMiniShelfStateService,
      mockedRundownTimingContextStateService: mockedRundownTimingContextStateService,
      mockedActionStateService: mockedActionStateService,
    })

    expect(component).toBeTruthy()
    expect(component.rundown).toEqual(mockedRundown)
    verify(mockedMiniShelfStateService.updateMiniShelves(mockedRundown)).once()

    verify(mockedRundownTimingContextStateService.subscribeToRundownTimingContext(mockedRundown.id)).once()
    verify(mockedActionStateService.subscribeToRundownActions(mockedRundown.id)).once()

    verify(mockedRundownEventObserver.subscribeToRundownDeactivation(anything())).once()
    verify(mockedRundownEventObserver.subscribeToRundownAutoNext(anything())).once()
    verify(mockedRundownEventObserver.subscribeToRundownSetNext(anything())).once()
    verify(mockedRundownEventObserver.subscribeToRundownReset(anything())).once()
    verify(mockedRundownEventObserver.subscribeToRundownUpdates(anything())).once()
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
    mockedMiniShelfStateService?: MiniShelfStateService
    mockedRundown?: Rundown
  } = {}
): Promise<RundownComponent> {
  const mockedRundownService: RundownService = params.mockedRundownService ?? mock<RundownService>()
  const mockedRundownEventObserver: RundownEventObserver = params.mockedRundownEventObserver ?? mock<RundownEventObserver>()
  const mockedDialogService: DialogService = params.mockedDialogService ?? mock<DialogService>()
  const mockedRundownTimingContextStateService: RundownTimingContextStateService = params.mockedRundownTimingContextStateService ?? createMockOfRundownTimingContextStateService()
  const mockedActionStateService: ActionStateService = params.mockedActionStateService ?? mock<ActionStateService>()
  const mockedEntityParser: EntityParser = params.mockedEntityParser ?? mock<EntityParser>()
  const mockedMiniShelfStateService: MiniShelfStateService = params.mockedMiniShelfStateService ?? mock<MiniShelfStateService>()

  await TestBed.configureTestingModule({
    providers: [
      { provide: RundownService, useValue: instance(mockedRundownService) },
      { provide: DialogService, useValue: instance(mockedDialogService) },
      { provide: RundownEventObserver, useValue: instance(mockedRundownEventObserver) },
      { provide: PartEntityService, useValue: instance(mock<PartEntityService>()) },
      { provide: RundownTimingContextStateService, useValue: instance(mockedRundownTimingContextStateService) },
      { provide: Logger, useValue: instance(mock<Logger>()) },
      { provide: ActionStateService, useValue: instance(mockedActionStateService) },
      { provide: EntityParser, useValue: instance(mockedEntityParser) },
      { provide: MiniShelfStateService, useValue: instance(mockedMiniShelfStateService) },
    ],
    declarations: [RundownComponent],
  }).compileComponents()

  const fixture: ComponentFixture<RundownComponent> = TestBed.createComponent(RundownComponent)
  const component: RundownComponent = fixture.componentInstance
  component.rundown = params.mockedRundown ?? new TestEntityFactory().createRundown()
  fixture.detectChanges()
  return component
}

function createMockOfRundownTimingContextStateService(): RundownTimingContextStateService {
  const mockedRundownTimingContextStateService: RundownTimingContextStateService = mock<RundownTimingContextStateService>()
  const mockedSubscription: Subscription = mock<Subscription>()
  const mockedObservable: Observable<RundownTimingContext> = mock<Observable<RundownTimingContext>>()
  when(mockedObservable.subscribe(anything())).thenReturn(instance(mockedSubscription))
  when(mockedRundownTimingContextStateService.subscribeToRundownTimingContext(anything())).thenResolve(instance(mockedObservable))
  return mockedRundownTimingContextStateService
}

function createMockOfActionStateService(): ActionStateService {
  const mockedActionStateService: ActionStateService = mock<ActionStateService>()
  const mockedSubscription: Subscription = mock<Subscription>()
  const mockedObservable: Observable<Action[]> = mock<Observable<Action[]>>()
  when(mockedObservable.subscribe(anything())).thenReturn(instance(mockedSubscription))
  when(mockedActionStateService.subscribeToRundownActions(anything())).thenResolve(instance(mockedObservable))
  return mockedActionStateService
}

function createMockOfMiniShelfStateService(): MiniShelfStateService {
  const mockedMiniShelfStateService: MiniShelfStateService = mock<MiniShelfStateService>()
  when(mockedMiniShelfStateService.updateMiniShelves(anything())).thenResolve()
  return mockedMiniShelfStateService
}

function createMockOfRundownEventObserver(): RundownEventObserver {
  const mockedRundownEventObserver: RundownEventObserver = mock<RundownEventObserver>()
  const mockedSubscriptionToRundownActivation: Subscription = mock<Subscription>()
  when(mockedRundownEventObserver.subscribeToRundownActivation(anything())).thenReturn(instance(mockedSubscriptionToRundownActivation))
  const mockedSubscriptionToRundownDeactivation: Subscription = mock<Subscription>()
  when(mockedRundownEventObserver.subscribeToRundownDeactivation(anything())).thenReturn(instance(mockedSubscriptionToRundownDeactivation))
  const mockedSubscriptionToRundownAutoNext: Subscription = mock<Subscription>()
  when(mockedRundownEventObserver.subscribeToRundownAutoNext(anything())).thenReturn(instance(mockedSubscriptionToRundownAutoNext))
  const mockedSubscriptionToRundownSetNext: Subscription = mock<Subscription>()
  when(mockedRundownEventObserver.subscribeToRundownSetNext(anything())).thenReturn(instance(mockedSubscriptionToRundownSetNext))
  const mockedSubscriptionToRundownReset: Subscription = mock<Subscription>()
  when(mockedRundownEventObserver.subscribeToRundownReset(anything())).thenReturn(instance(mockedSubscriptionToRundownReset))
  const mockedSubscriptionToRundownUpdates: Subscription = mock<Subscription>()
  when(mockedRundownEventObserver.subscribeToRundownUpdates(anything())).thenReturn(instance(mockedSubscriptionToRundownUpdates))
  return mockedRundownEventObserver
}
