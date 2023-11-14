import { RundownTimingService } from './rundown-timing.service'
import { Rundown } from '../models/rundown'
import { TestEntityFactory } from '../../test/factories/test-entity.factory'
import { RundownTiming } from '../models/rundown-timing'
import { Segment } from '../models/segment'
import { RundownTimingType } from '../enums/rundown-timing-type'

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
        it('return the time difference between estimated end and planned end', () => {
          const durationInMsToPlannedEndFromNow: number = 10_000
          const rundownExpectedDurationInMs: number = 30_000
          const numberOfSegments: number = 4
          const segments: Segment[] = [...Array(numberOfSegments)].map((_, index) =>
            testEntityFactory.createSegment({ id: index.toString(), budgetDuration: rundownExpectedDurationInMs / numberOfSegments })
          )
          const timing: RundownTiming = {
            type: RundownTimingType.BACKWARD,
            expectedEndEpochTime: Date.now() + durationInMsToPlannedEndFromNow,
            expectedDurationInMs: rundownExpectedDurationInMs,
          }
          const rundown: Rundown = testEntityFactory.createRundown({ isActive: false, segments, timing })
          const testee: RundownTimingService = createTestee()
          const estimatedEndEpochTime: number = Date.now() + rundownExpectedDurationInMs
          const expectedResult: number = estimatedEndEpochTime - timing.expectedEndEpochTime

          const result: number = testee.getRundownScheduleOffsetInMs(rundown)

          expect(result).toBe(expectedResult)
        })
      })

      describe('when planned end is in the past', () => {
        it('return the time difference between estimated and planned end', () => {
          const durationInMsToPlannedEndFromNow: number = -10_000
          const rundownExpectedDurationInMs: number = 30_000
          const numberOfSegments: number = 4
          const testEntityFactory: TestEntityFactory = new TestEntityFactory()
          const segments: Segment[] = [...Array(numberOfSegments)].map((_, index) =>
            testEntityFactory.createSegment({ id: index.toString(), budgetDuration: rundownExpectedDurationInMs / numberOfSegments })
          )
          const timing: RundownTiming = {
            type: RundownTimingType.BACKWARD,
            expectedEndEpochTime: Date.now() + durationInMsToPlannedEndFromNow,
            expectedDurationInMs: rundownExpectedDurationInMs,
          }
          const rundown: Rundown = testEntityFactory.createRundown({ isActive: false, segments, timing })
          const testee: RundownTimingService = createTestee()
          const estimatedEndEpochTime: number = Date.now() + rundownExpectedDurationInMs
          const expectedResult: number = estimatedEndEpochTime - timing.expectedEndEpochTime

          const result: number = testee.getRundownScheduleOffsetInMs(rundown)

          expect(result).toBe(expectedResult)
        })
      })
    })

    describe('when rundown is active', () => {
      describe('when rundown has no segment on air', () => {
        describe('when rundown has no continuity segment', () => {
          it('returns the difference with remaining time being based on all subsequent segments from the start of the next segment', () => {
            const durationInMsToPlannedEndFromNow: number = 10_000
            const rundownExpectedDurationInMs: number = 30_000
            const numberOfSegments: number = 4
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const segments: Segment[] = [...Array(numberOfSegments)].map((_, index) =>
              testEntityFactory.createSegment({ id: index.toString(), budgetDuration: rundownExpectedDurationInMs / numberOfSegments })
            )
            const nextSegmentDuration: number = 2_000
            const nextSegment: Segment = testEntityFactory.createSegment({ id: 'nextSegment', isNext: true, budgetDuration: nextSegmentDuration })
            segments.unshift(nextSegment)
            const timing: RundownTiming = {
              type: RundownTimingType.BACKWARD,
              expectedEndEpochTime: Date.now() + durationInMsToPlannedEndFromNow,
              expectedDurationInMs: rundownExpectedDurationInMs,
            }
            const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments, timing })
            const testee: RundownTimingService = createTestee()
            const estimateEndEpocTime: number = Date.now() + rundownExpectedDurationInMs + nextSegmentDuration
            const expectedResult: number = estimateEndEpocTime - timing.expectedEndEpochTime

            const result: number = testee.getRundownScheduleOffsetInMs(rundown)

            expect(result).toBe(expectedResult)
          })
        })
      })

      describe('when rundown has one continuity segment', () => {
        it('returns the difference with remaining time being based on all subsequent segments between the start of the next segment and the continuity segment', () => {
          const durationInMsToPlannedEndFromNow: number = 12_000
          const rundownExpectedDurationInMs: number = 30_000
          const numberOfSegments: number = 5
          const testEntityFactory: TestEntityFactory = new TestEntityFactory()
          const segments: Segment[] = [...Array(numberOfSegments)].map((_, index) =>
            testEntityFactory.createSegment({ id: index.toString(), budgetDuration: rundownExpectedDurationInMs / numberOfSegments })
          )

          const nextSegmentDuration: number = 2_000
          const nextSegment: Segment = testEntityFactory.createSegment({ id: 'nextSegment', isNext: true, budgetDuration: nextSegmentDuration })
          segments.unshift(nextSegment)
          const continuitySegment: Segment = testEntityFactory.createSegment({ name: 'CONTINUITY' })
          segments.push(continuitySegment)
          // TODO: Insert segment after continuity

          const timing: RundownTiming = {
            type: RundownTimingType.BACKWARD,
            expectedEndEpochTime: Date.now() + durationInMsToPlannedEndFromNow,
            expectedDurationInMs: rundownExpectedDurationInMs,
          }
          const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments, timing })
          const testee: RundownTimingService = createTestee()

          const estimateEndEpocTime: number = Date.now() + rundownExpectedDurationInMs + nextSegmentDuration
          const expectedResult: number = estimateEndEpocTime - timing.expectedEndEpochTime

          const result: number = testee.getRundownScheduleOffsetInMs(rundown)

          expect(result).toBe(expectedResult)
        })
      })
    })

    describe('when rundown has a segment on air', () => {
      describe('when rundown has no continuity segment', () => {
        describe('when next segment is before the on air segment', () => {
          it('?????', () => {})
        })

        describe('when next segment is the on air segment', () => {
          it('?????', () => {})
        })

        describe('when next segment is after the on air segment', () => {
          it('?????', () => {})
        })
      })

      describe('when rundown has one continuity segment', () => {
        describe('when next segment is before the on air segment', () => {
          it('?????', () => {})
        })

        describe('when next segment is the on air segment', () => {
          it('?????', () => {})
        })

        describe('when next segment is after the on air segment', () => {
          it('?????', () => {})
        })
      })
    })
  })
})

function createTestee(): RundownTimingService {
  return new RundownTimingService()
}
