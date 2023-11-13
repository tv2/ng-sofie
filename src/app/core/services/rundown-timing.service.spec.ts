import { RundownTimingService } from './rundown-timing.service'
import { Rundown } from '../models/rundown'
import { TestEntityFactory } from '../../test/factories/test-entity.factory'
import { RundownTiming } from '../models/rundown-timing'
import { Segment } from '../models/segment'
import { RundownTimingType } from '../enums/rundown-timing-type'
import { Part } from '../models/part'

const DEFAULT_SEGMENT_BUDGET_DURATION_IN_MS: number = 2000
describe(RundownTimingService.name, () => {
  const testEntityFactory: TestEntityFactory = new TestEntityFactory()
  beforeEach(() => {
    jasmine.clock().install()
    jasmine.clock().mockDate(new Date())
  })
  afterEach(() => jasmine.clock().uninstall())

  describe(RundownTimingService.prototype.getRundownScheduleOffsetInMs.name, () => {
    describe('when rundown is inactive', () => {
      describe('when planned end is in the future', () => {
        it('return the time difference between now and planned end', () => {
          const millisecondsBeforePlannedEnd: number = 10_000
          const timing: RundownTiming = {
            type: RundownTimingType.BACKWARD,
            expectedEndEpochTime: Date.now() + millisecondsBeforePlannedEnd,
          }
          const rundown: Rundown = createDummyRundown({ isActive: false, timing }, 5)
          const testee: RundownTimingService = createTestee()
          const expectedResult: number = -millisecondsBeforePlannedEnd

          const result: number = testee.getRundownScheduleOffsetInMs(rundown)

          expect(result).toBe(expectedResult)
        })
      })
      describe('when planned end is in the past', () => {
        it('return the time difference between now and planned end', () => {
          const millisecondsSincePlannedEnd: number = 10_000
          const timing: RundownTiming = {
            type: RundownTimingType.BACKWARD,
            expectedEndEpochTime: Date.now() - millisecondsSincePlannedEnd,
          }
          const rundown: Rundown = createDummyRundown({ isActive: false, timing }, 5)
          const testee: RundownTimingService = createTestee()
          const expectedResult: number = millisecondsSincePlannedEnd

          const result: number = testee.getRundownScheduleOffsetInMs(rundown)

          expect(result).toBe(expectedResult)
        })
      })
    })

    describe('when rundown is active', () => {
      const nextSegment: Segment = testEntityFactory.createSegment({ id: 'next', budgetDuration: DEFAULT_SEGMENT_BUDGET_DURATION_IN_MS, isNext: true })

      describe('when planned end is in the future', () => {
        it('return the time difference between next cursor on first segment and planned end', () => {
          const millisecondsBeforePlannedEnd: number = 12_000
          const timing: RundownTiming = {
            type: RundownTimingType.BACKWARD,
            expectedEndEpochTime: Date.now() + millisecondsBeforePlannedEnd,
          }
          const rundown: Rundown = createDummyRundown({ isActive: true, timing }, 5)
          rundown.segments.unshift(nextSegment)
          const testee: RundownTimingService = createTestee()
          const expectedResult: number = -millisecondsBeforePlannedEnd

          const result: number = testee.getRundownScheduleOffsetInMs(rundown)

          expect(result).toBe(expectedResult)
        })
        it('return the time difference between next cursor on third segment and planned end', () => {
          const millisecondsBeforePlannedEnd: number = 8_000
          const timing: RundownTiming = {
            type: RundownTimingType.BACKWARD,
            expectedEndEpochTime: Date.now() + millisecondsBeforePlannedEnd,
          }
          const rundown: Rundown = createDummyRundown({ isActive: true, timing }, 5)
          rundown.segments.splice(2, 0, nextSegment)
          const testee: RundownTimingService = createTestee()
          const expectedResult: number = -millisecondsBeforePlannedEnd

          const result: number = testee.getRundownScheduleOffsetInMs(rundown)

          expect(result).toBe(expectedResult)
        })
        it('', () => {
          const testEntityFactory: TestEntityFactory = new TestEntityFactory()
          const parts: Part[] = [testEntityFactory.createPart({ isOnAir: true, executedAt: Date.now() }), testEntityFactory.createPart({ isNext: true })]
          const segmentBudgetDuration: number = 2000
          const segment: Segment = testEntityFactory.createSegment({ parts, budgetDuration: segmentBudgetDuration, isOnAir: true, isNext: true })
          const timing: RundownTiming = {
            type: RundownTimingType.BACKWARD,
            expectedEndEpochTime: Date.now() + segmentBudgetDuration,
          }
          const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, timing: timing, segments: [segment] })
          const playedPartDuration: number = 1000
          const testee: RundownTimingService = createTestee()
          const expectedResult: number = playedPartDuration - segmentBudgetDuration
          jasmine.clock().tick(playedPartDuration)
          const result: number = testee.getRundownScheduleOffsetInMs(rundown)
          expect(result).toBe(expectedResult)
        })
      })

      describe('when planned end is in the past', () => {
        it('return the time difference between next cursor on first segment and planned end', () => {
          const millisecondsSincePlannedEnd: number = 12_000
          const timing: RundownTiming = {
            type: RundownTimingType.BACKWARD,
            expectedEndEpochTime: Date.now() - millisecondsSincePlannedEnd,
          }
          const rundown: Rundown = createDummyRundown({ isActive: true, timing }, 5)
          rundown.segments.unshift(nextSegment)
          const testee: RundownTimingService = createTestee()
          const expectedResult: number = millisecondsSincePlannedEnd

          const result: number = testee.getRundownScheduleOffsetInMs(rundown)

          expect(result).toBe(expectedResult)
        })
        it('return the time difference between next cursor on third segment and planned end', () => {
          const millisecondsBeforePlannedEnd: number = 8_000
          const timing: RundownTiming = {
            type: RundownTimingType.BACKWARD,
            expectedEndEpochTime: Date.now() - millisecondsBeforePlannedEnd,
          }
          const rundown: Rundown = createDummyRundown({ isActive: true, timing }, 5)
          rundown.segments.splice(2, 0, nextSegment)
          const testee: RundownTimingService = createTestee()
          const expectedResult: number = millisecondsBeforePlannedEnd

          const result: number = testee.getRundownScheduleOffsetInMs(rundown)

          expect(result).toBe(expectedResult)
        })
      })
    })
  })
})

function createDummyRundown(partialRundown: Partial<Rundown> = {}, amountOfSegments: number): Rundown {
  const testEntityFactory: TestEntityFactory = new TestEntityFactory()
  const segments: Segment[] = [...Array(amountOfSegments)].map((_, index) => testEntityFactory.createSegment({ id: index.toString(), budgetDuration: DEFAULT_SEGMENT_BUDGET_DURATION_IN_MS }))
  return testEntityFactory.createRundown({ segments, ...partialRundown })
}

function createTestee(): RundownTimingService {
  return new RundownTimingService()
}
