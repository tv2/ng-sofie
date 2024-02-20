import { MiniShelfNavigationService } from './mini-shelf-navigation.service'
import { Segment } from '../../core/models/segment'
import { TestEntityFactory } from '../../test/factories/test-entity.factory'
import { Tv2VideoClipAction } from '../../shared/models/tv2-action'

function createTestee(): MiniShelfNavigationService {
  return new MiniShelfNavigationService()
}

describe(MiniShelfNavigationService.name, () => {
  const testEntityFactory: TestEntityFactory = new TestEntityFactory()

  it('should match getting the previous MiniShelf on a rundown onAir with two MiniShelves', () => {
    const actionOne: Tv2VideoClipAction = testEntityFactory.createTv2VideoClipAction('firstMiniShelf')
    const actionTwo: Tv2VideoClipAction = testEntityFactory.createTv2VideoClipAction('secondMiniShelf')

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

    const rundown = testEntityFactory.createRundown({
      id: 'rundown-id',
      isActive: true,
      segments: [segment, firstMiniShelf, secondMiniShelf],
    })

    const testee: MiniShelfNavigationService = createTestee()

    const expectedSegment: Segment = testee.getPreviousMiniShelfSegment(rundown, [actionOne, actionTwo])

    expect(expectedSegment).toEqual(firstMiniShelf)
  })

  it('should match getting the next MiniShelf on a rundown onAir with two MiniShelves', () => {
    const actionOne: Tv2VideoClipAction = testEntityFactory.createTv2VideoClipAction('firstMiniShelf')
    const actionTwo: Tv2VideoClipAction = testEntityFactory.createTv2VideoClipAction('secondMiniShelf')

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
      miniShelfVideoClipFile: 'firstMiniShelfVideoClipFile',
    })

    const secondMiniShelf: Segment = testEntityFactory.createMiniShelfSegment({
      id: 'secondMiniShelf',
      miniShelfVideoClipFile: 'secondMiniShelfVideoClipFile',
    })

    const rundown = testEntityFactory.createRundown({
      id: 'rundown-id',
      isActive: true,
      segments: [segment, firstMiniShelf, secondMiniShelf],
    })

    const testee: MiniShelfNavigationService = createTestee()

    const expectedSegment: Segment = testee.getNextMiniShelfSegment(rundown, [actionOne, actionTwo])

    expect(expectedSegment).toEqual(firstMiniShelf)
  })
})
