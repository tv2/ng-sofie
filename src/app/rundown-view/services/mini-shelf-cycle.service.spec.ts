import { MiniShelfCycleService } from './mini-shelf-cycle.service'
import { ActionService } from '../../shared/abstractions/action.service'
import { anyString, anything, instance, mock, verify, when } from '@typestrong/ts-mockito'
import { Observable } from 'rxjs'
import { MiniShelfNavigationService } from './mini-shelf-navigation.service'
import { ActionStateService } from '../../shared/services/action-state.service'
import { TestEntityFactory } from '../../test/factories/test-entity.factory'
import { Action } from '../../shared/models/action'
import { Segment } from '../../core/models/segment'
import { TestLoggerFactory } from '../../test/factories/test-logger.factory'
import { Tv2Action } from '../../shared/models/tv2-action'
import { NotificationService } from '../../shared/services/notification.service'
import { RundownMode } from 'src/app/core/enums/rundown-mode'

describe(MiniShelfCycleService.name, () => {
  const testEntityFactory: TestEntityFactory = new TestEntityFactory()

  it('should set as next the second MiniShelf after a segment onAir on cycle backwards and not the first one', () => {
    const mockedActionService: ActionService = mock<ActionService>()
    when(mockedActionService.executeAction(anyString(), anyString())).thenReturn(instance(mock<Observable<void>>()) as Observable<void>)

    const firstAction: Tv2Action = testEntityFactory.createTv2VideoClipAction('firstMiniShelfName', 'firstMiniShelfVideoClipFile')
    const secondAction: Tv2Action = testEntityFactory.createTv2VideoClipAction('secondMiniShelfName', 'secondMiniShelfVideoClipFile')

    const mockedActionStateService: ActionStateService = mock<ActionStateService>()
    when(mockedActionStateService.getRundownActions(anyString())).thenReturn([firstAction, secondAction])

    const segment: Segment = testEntityFactory.createSegment({
      id: 'segmentOnAir',
      isOnAir: true,
      isNext: true,
      isHidden: false,
      parts: [
        testEntityFactory.createPart({
          isOnAir: true,
          metadata: { actionId: 'testPartOnAir' },
        }),
        testEntityFactory.createPart({
          isNext: true,
          metadata: { actionId: 'testPartNext' },
        }),
      ],
    })

    const firstMiniShelf: Segment = testEntityFactory.createMiniShelfSegment({
      id: 'firstMiniShelfId',
      name: firstAction.name,
      miniShelfVideoClipFile: 'firstMiniShelfVideoClipFile',
    })

    const secondMiniShelf: Segment = testEntityFactory.createMiniShelfSegment({
      id: 'secondMiniShelfId',
      name: secondAction.name,
      miniShelfVideoClipFile: 'secondMiniShelfVideoClipFile',
    })

    const miniShelfNavigationService: MiniShelfNavigationService = mock<MiniShelfNavigationService>()
    when(miniShelfNavigationService.getPreviousMiniShelfSegment(anything(), anything())).thenReturn(secondMiniShelf)

    const testee: MiniShelfCycleService = createTestee({
      actionService: instance(mockedActionService),
      actionStateService: instance(mockedActionStateService),
      miniShelfNavigationService: instance(miniShelfNavigationService),
    })

    const rundown = testEntityFactory.createRundown({
      id: 'rundown-id',
      mode: RundownMode.ACTIVE,
      segments: [segment, firstMiniShelf, secondMiniShelf],
    })

    testee.cycleMiniShelfBackward(rundown)

    verify(mockedActionService.executeAction(firstAction.id, rundown.id)).never()

    verify(mockedActionService.executeAction(secondAction.id, rundown.id)).once()
  })

  it('should set as next the first MiniShelf after a segment onAir on cycle forwards and not the second one', () => {
    const mockedActionService: ActionService = mock<ActionService>()
    when(mockedActionService.executeAction(anyString(), anyString())).thenReturn(instance(mock<Observable<void>>()) as Observable<void>)

    const firstAction: Tv2Action = testEntityFactory.createTv2VideoClipAction('firstMiniShelfName', 'firstMiniShelfVideoClipFile')
    const secondAction: Tv2Action = testEntityFactory.createTv2VideoClipAction('secondMiniShelfName', 'secondMiniShelfVideoClipFile')

    const mockedActionStateService: ActionStateService = mock<ActionStateService>()
    when(mockedActionStateService.getRundownActions(anyString())).thenReturn([firstAction, secondAction])

    const segment: Segment = testEntityFactory.createSegment({
      id: 'segmentOnAir',
      isOnAir: true,
      isNext: true,
      isHidden: false,
      parts: [
        testEntityFactory.createPart({
          isOnAir: true,
          metadata: { actionId: 'testPartOnAir' },
        }),
        testEntityFactory.createPart({
          isNext: true,
          metadata: { actionId: 'testPartNext' },
        }),
      ],
    })

    const firstMiniShelf: Segment = testEntityFactory.createMiniShelfSegment({
      id: 'firstMiniShelfId',
      name: firstAction.name,
      miniShelfVideoClipFile: 'firstMiniShelfVideoClipFile',
    })

    const secondMiniShelf: Segment = testEntityFactory.createMiniShelfSegment({
      id: 'secondMiniShelfId',
      name: secondAction.name,
      miniShelfVideoClipFile: 'secondMiniShelfVideoClipFile',
    })

    const miniShelfNavigationService: MiniShelfNavigationService = mock<MiniShelfNavigationService>()
    when(miniShelfNavigationService.getNextMiniShelfSegment(anything(), anything())).thenReturn(secondMiniShelf)

    const testee: MiniShelfCycleService = createTestee({
      actionService: instance(mockedActionService),
      actionStateService: instance(mockedActionStateService),
      miniShelfNavigationService: instance(miniShelfNavigationService),
    })

    const rundown = testEntityFactory.createRundown({
      id: 'rundown-id',
      mode: RundownMode.ACTIVE,
      segments: [segment, firstMiniShelf, secondMiniShelf],
    })

    testee.cycleMiniShelfForward(rundown)

    verify(mockedActionService.executeAction(firstAction.id, rundown.id)).never()

    verify(mockedActionService.executeAction(secondAction.id, rundown.id)).once()
  })
})

function createTestee(
  params: {
    actionService?: ActionService
    miniShelfNavigationService?: MiniShelfNavigationService
    actionStateService?: ActionStateService
    notificationService?: NotificationService
  } = {}
): MiniShelfCycleService {
  const miniShelfNavigationService: MiniShelfNavigationService = params.miniShelfNavigationService ?? mock(MiniShelfNavigationService)

  const actionStateService: ActionStateService = params.actionStateService ?? mock(ActionStateService)

  const actionServiceMock: ActionService = mock<ActionService>()
  when(actionServiceMock.executeAction(anything(), anything())).thenReturn(instance(mock<Observable<void>>()) as Observable<void>)
  when(actionServiceMock.getActionsByRundownId(anyString())).thenReturn(instance(mock<Observable<Action[]>>()) as Observable<Action[]>)
  when(actionServiceMock.getSystemActions()).thenReturn(instance(mock<Observable<Action[]>>()) as Observable<Action[]>)

  const actionService: ActionService = params.actionService ?? actionServiceMock

  const notificationService: NotificationService = params.notificationService ?? mock(NotificationService)
  return new MiniShelfCycleService(
    params?.miniShelfNavigationService ?? instance(miniShelfNavigationService),
    params?.actionStateService ?? instance(actionStateService),
    params?.actionService ?? instance(actionService),
    params?.notificationService ?? instance(notificationService),
    new TestLoggerFactory().createLogger()
  )
}
