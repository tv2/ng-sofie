import { RundownTimingService } from './rundown-timing.service'
import { Rundown } from '../models/rundown'
import { TestEntityFactory } from '../../test/factories/test-entity.factory'
import { RundownTiming } from '../models/rundown-timing'
import { Segment } from '../models/segment'
import { RundownTimingType } from '../enums/rundown-timing-type'

describe(RundownTimingService.name, () => {
  beforeEach(() => jasmine.clock().install())
  afterEach(() => jasmine.clock().uninstall())

  describe(RundownTimingService.prototype.getRundownScheduleOffsetInMs.name, () => {
    describe('when rundown is inactive', () => {
      describe('when planned end is in the future', () => {
        it('', () => {

        })
      })

      describe('when planned end is in the past', () => {
        it('returns the time difference from current time to the planned end', () => {
          const millisecondsSincePlannedEnd: number = 10_000
          const timing: RundownTiming = {
            type: RundownTimingType.BACKWARD,
            expectedEndEpochTime: Date.now() - millisecondsSincePlannedEnd
          }
          const rundown: Rundown = createDummyRundown({ isActive: false, timing })
          const testee: RundownTimingService = createTestee()
          const expectedResult: number = millisecondsSincePlannedEnd

          const result = testee.getRundownScheduleOffsetInMs(rundown)

          expect(result).toBe(expectedResult)
        })
      })
    })

    describe('when rundown is active', () => {
      it('', () => {})
    })
  })
})

function createDummyRundown(partialRundown: Partial<Rundown> = {}): Rundown {
  const defaultBudgetDurationInMs: number = 2000
  const testEntityFactory: TestEntityFactory = new TestEntityFactory()
  const segments: Segment[] = [...Array(5)]
    .map((_, index) =>
      testEntityFactory.createSegment({ id: index.toString(), budgetDuration: defaultBudgetDurationInMs })
    )
  return testEntityFactory.createRundown({ segments, ...partialRundown })
}

function createTestee(): RundownTimingService {
  return new RundownTimingService()
}
