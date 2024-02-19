import { MiniShelfCycleService } from './mini-shelf-cycle.service'
import { ActionService } from '../../shared/abstractions/action.service'
import { anyString, anything, instance, mock, verify, when } from '@typestrong/ts-mockito'
import { Observable } from 'rxjs'
import { MiniShelfNavigationService } from './mini-shelf-navigation.service'
import { ActionStateService } from '../../shared/services/action-state.service'
import { TestEntityFactory } from '../../test/factories/test-entity.factory'
import { Action } from '../../shared/models/action'
import { Segment } from '../../core/models/segment'

describe(MiniShelfCycleService.name, () => {
  const testEntityFactory: TestEntityFactory = new TestEntityFactory()

  it('should set as next the second MiniShelf after a segment onAir on cycle backwards and not the first one', () => {
    const actionService: ActionService = mock<ActionService>()
    when(actionService.executeAction(anyString(), anyString())).thenReturn(instance(mock<Observable<void>>()) as Observable<void>)

    const actionStateService: ActionStateService = mock<ActionStateService>()
    when(actionStateService.getRundownActions(anyString())).thenReturn([testEntityFactory.createTv2VideoClipAction('firstMiniShelf'), testEntityFactory.createTv2VideoClipAction('secondMiniShelf')])

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
      id: 'firstMiniShelf',
      miniShelfVideoClipFile: 'firstMiniShelf',
    })
    const secondMiniShelf: Segment = testEntityFactory.createMiniShelfSegment({
      id: 'secondMiniShelf',
      miniShelfVideoClipFile: 'secondMiniShelf',
    })

    const miniShelfNavigationService: MiniShelfNavigationService = mock<MiniShelfNavigationService>()
    when(miniShelfNavigationService.getPreviousMiniShelfSegment(anything(), anything())).thenReturn(secondMiniShelf)

    const testee: MiniShelfCycleService = createTestee({
      actionService: instance(actionService),
      actionStateService: instance(actionStateService),
      miniShelfNavigationService: instance(miniShelfNavigationService),
    })

    testee.cycleMiniShelfBackward(
      testEntityFactory.createRundown({
        id: 'rundown-id',
        isActive: true,
        segments: [segment, firstMiniShelf, secondMiniShelf],
      })
    )

    verify(actionService.executeAction('actionId_secondMiniShelf', 'rundown-id')).once()

    verify(actionService.executeAction('actionId_firstMiniShelf', 'rundown-id')).never()
  })

  it('should set as next the first MiniShelf after a segment onAir on cycle forwards and not the second one', () => {
    const actionService: ActionService = mock<ActionService>()
    when(actionService.executeAction(anyString(), anyString())).thenReturn(instance(mock<Observable<void>>()) as Observable<void>)

    const actionStateService: ActionStateService = mock<ActionStateService>()
    when(actionStateService.getRundownActions(anyString())).thenReturn([testEntityFactory.createTv2VideoClipAction('firstMiniShelf'), testEntityFactory.createTv2VideoClipAction('secondMiniShelf')])

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
      id: 'firstMiniShelf',
      miniShelfVideoClipFile: 'firstMiniShelf',
    })
    const secondMiniShelf: Segment = testEntityFactory.createMiniShelfSegment({
      id: 'secondMiniShelf',
      miniShelfVideoClipFile: 'secondMiniShelf',
    })

    const miniShelfNavigationService: MiniShelfNavigationService = mock<MiniShelfNavigationService>()
    when(miniShelfNavigationService.getPreviousMiniShelfSegment(anything(), anything())).thenReturn(firstMiniShelf)

    const testee: MiniShelfCycleService = createTestee({
      actionService: instance(actionService),
      actionStateService: instance(actionStateService),
      miniShelfNavigationService: instance(miniShelfNavigationService),
    })

    testee.cycleMiniShelfBackward(
      testEntityFactory.createRundown({
        id: 'rundown-id',
        isActive: true,
        segments: [segment, firstMiniShelf, secondMiniShelf],
      })
    )

    verify(actionService.executeAction('actionId_firstMiniShelf', 'rundown-id')).once()

    verify(actionService.executeAction('actionId_secondMiniShelf', 'rundown-id')).never()
  })
})

function createTestee(params?: { actionService?: ActionService; miniShelfNavigationService?: MiniShelfNavigationService; actionStateService?: ActionStateService }): MiniShelfCycleService {
  let miniShelfNavigationService: MiniShelfNavigationService
  if (!params?.miniShelfNavigationService) {
    const miniShelfNavigationServiceMock: MiniShelfNavigationService = mock<MiniShelfNavigationService>()
    miniShelfNavigationService = instance(miniShelfNavigationServiceMock)
  }

  let actionStateService: ActionStateService
  if (!params?.actionStateService) {
    const actionStateServiceMock: ActionStateService = mock<ActionStateService>()
    actionStateService = instance(actionStateServiceMock)
  }

  let actionService: ActionService
  if (!params?.actionService) {
    const actionServiceMock: ActionService = mock<ActionService>()
    when(actionServiceMock.executeAction(anything(), anything())).thenReturn(instance(mock<Observable<void>>()) as Observable<void>)
    when(actionServiceMock.getActionsByRundownId(anyString())).thenReturn(instance(mock<Observable<Action[]>>()) as Observable<Action[]>)
    when(actionServiceMock.getSystemActions()).thenReturn(instance(mock<Observable<Action[]>>()) as Observable<Action[]>)

    actionService = instance(actionServiceMock)
  }

  return new MiniShelfCycleService(params?.miniShelfNavigationService ?? miniShelfNavigationService!, params?.actionStateService ?? actionStateService!, params?.actionService ?? actionService!)
}
