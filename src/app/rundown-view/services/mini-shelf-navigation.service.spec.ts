import { MiniShelfNavigationService } from './mini-shelf-navigation.service'
import { Segment } from '../../core/models/segment'
import { TestEntityFactory } from '../../test/factories/test-entity.factory'
import { Tv2Action } from '../../shared/models/tv2-action'
import { ActionService } from '../../shared/abstractions/action.service'
import { anyString, anything, instance, mock, when } from '@typestrong/ts-mockito'
import { Observable } from 'rxjs'
import { ActionStateService } from '../../shared/services/action-state.service'
import { Rundown } from '../../core/models/rundown'
import { RundownMode } from '../../core/enums/rundown-mode'

function createTestee(): MiniShelfNavigationService {
  return new MiniShelfNavigationService()
}

describe(MiniShelfNavigationService.name, () => {
  it('should match getting the previous MiniShelf on a rundown onAir with two MiniShelves', () => {
    const mockedActionService: ActionService = mock<ActionService>()
    when(mockedActionService.executeAction(anyString(), anyString())).thenReturn(instance(mock<Observable<void>>()) as Observable<void>)

    const firstAction: Tv2Action = TestEntityFactory.createTv2VideoClipAction('firstMiniShelfName', 'firstMiniShelfVideoClipFile')
    const secondAction: Tv2Action = TestEntityFactory.createTv2VideoClipAction('secondMiniShelfName', 'secondMiniShelfVideoClipFile')

    const mockedActionStateService: ActionStateService = mock<ActionStateService>()
    when(mockedActionStateService.getRundownActions(anyString())).thenReturn([firstAction, secondAction])

    const segment: Segment = TestEntityFactory.createSegment({
      id: 'segmentOnAir',
      isOnAir: true,
      isNext: true,
      isHidden: false,
      parts: [
        TestEntityFactory.createPart({
          isOnAir: true,
          metadata: { actionId: 'testPartOnAir' },
        }),
        TestEntityFactory.createPart({
          isNext: true,
          metadata: { actionId: 'testPartNext' },
        }),
      ],
    })

    const firstMiniShelf: Segment = TestEntityFactory.createMiniShelfSegment({
      id: 'firstMiniShelfId',
      name: firstAction.name,
      miniShelfVideoClipFile: 'firstMiniShelfVideoClipFile',
    })

    const secondMiniShelf: Segment = TestEntityFactory.createMiniShelfSegment({
      id: 'secondMiniShelfId',
      name: secondAction.name,
      miniShelfVideoClipFile: 'secondMiniShelfVideoClipFile',
    })

    const miniShelfNavigationService: MiniShelfNavigationService = mock<MiniShelfNavigationService>()
    when(miniShelfNavigationService.getNextMiniShelfSegment(anything(), anything())).thenReturn(secondMiniShelf)

    const rundown: Rundown = TestEntityFactory.createRundown({
      id: 'rundown-id',
      mode: RundownMode.ACTIVE,
      segments: [segment, firstMiniShelf, secondMiniShelf],
    })

    const testee: MiniShelfNavigationService = createTestee()

    const expectedSegment: Segment = testee.getPreviousMiniShelfSegment(rundown, [firstAction, secondAction])

    expect(expectedSegment).toEqual(firstMiniShelf)
  })

  it('should match getting the next MiniShelf on a rundown onAir with two MiniShelves', () => {
    const mockedActionService: ActionService = mock<ActionService>()
    when(mockedActionService.executeAction(anyString(), anyString())).thenReturn(instance(mock<Observable<void>>()) as Observable<void>)

    const firstAction: Tv2Action = TestEntityFactory.createTv2VideoClipAction('firstMiniShelfName', 'firstMiniShelfVideoClipFile')
    const secondAction: Tv2Action = TestEntityFactory.createTv2VideoClipAction('secondMiniShelfName', 'secondMiniShelfVideoClipFile')

    const mockedActionStateService: ActionStateService = mock<ActionStateService>()
    when(mockedActionStateService.getRundownActions(anyString())).thenReturn([firstAction, secondAction])

    const segment: Segment = TestEntityFactory.createSegment({
      id: 'segmentOnAir',
      isOnAir: true,
      isNext: true,
      isHidden: false,
      parts: [
        TestEntityFactory.createPart({
          isOnAir: true,
          metadata: { actionId: 'testPartOnAir' },
        }),
        TestEntityFactory.createPart({
          isNext: true,
          metadata: { actionId: 'testPartNext' },
        }),
      ],
    })

    const firstMiniShelf: Segment = TestEntityFactory.createMiniShelfSegment({
      id: 'firstMiniShelfId',
      name: firstAction.name,
      miniShelfVideoClipFile: 'firstMiniShelfVideoClipFile',
    })

    const secondMiniShelf: Segment = TestEntityFactory.createMiniShelfSegment({
      id: 'secondMiniShelfId',
      name: secondAction.name,
      miniShelfVideoClipFile: 'secondMiniShelfVideoClipFile',
    })

    const miniShelfNavigationService: MiniShelfNavigationService = mock<MiniShelfNavigationService>()
    when(miniShelfNavigationService.getNextMiniShelfSegment(anything(), anything())).thenReturn(secondMiniShelf)

    const rundown: Rundown = TestEntityFactory.createRundown({
      id: 'rundown-id',
      mode: RundownMode.ACTIVE,
      segments: [segment, firstMiniShelf, secondMiniShelf],
    })

    const testee: MiniShelfNavigationService = createTestee()

    const expectedSegment: Segment = testee.getNextMiniShelfSegment(rundown, [firstAction, secondAction])

    expect(expectedSegment).toEqual(firstMiniShelf)
  })
})
