import { RundownNavigationService } from './rundown-navigation-service'
import { TestEntityFactory } from '../../core/services/models/test-entity.factory'
import { Segment } from '../../core/models/segment'
import { Rundown } from '../../core/models/rundown'
import { RundownCursor } from '../../core/models/rundown-cursor'

describe(RundownNavigationService.name, () => {
  describe(RundownNavigationService.prototype.getRundownCursorForNearestValidSegmentBeforeSegmentMarkedAsNext.name, () => {
    it('throws an error when the next cursor is on the first element', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const segments: Segment[] = [
          testEntityFactory.createSegment({ id: 'first-segment-id' }),
          testEntityFactory.createSegment({ id: 'next-segment-id', isNext: true }),
      ]
      const rundown: Rundown = testEntityFactory.createRundown({ segments })
      const testee: RundownNavigationService = createTestee()

      const result: () => RundownCursor = () => testee.getRundownCursorForNearestValidSegmentBeforeSegmentMarkedAsNext(rundown)

      expect(result).toThrow()
    })
  })
})

function createTestee(): RundownNavigationService {
  return new RundownNavigationService()
}
