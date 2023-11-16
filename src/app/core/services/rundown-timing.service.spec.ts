import { RundownTimingService } from './rundown-timing.service'
import { Rundown } from '../models/rundown'
import { TestEntityFactory } from '../../test/factories/test-entity.factory'
import { BackwardRundownTiming, RundownTiming } from '../models/rundown-timing'
import { Segment } from '../models/segment'
import { RundownTimingType } from '../enums/rundown-timing-type'
import { Part } from '../models/part'
import { PartEntityService } from './models/part-entity.service'
import { instance, mock } from '@typestrong/ts-mockito'

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
          const segments: Segment[] = Array(numberOfSegments).map((_, index) =>
            testEntityFactory.createSegment({
              id: index.toString(),
              budgetDuration: rundownExpectedDurationInMs / numberOfSegments,
            })
          )
          const timing: RundownTiming = {
            type: RundownTimingType.BACKWARD,
            expectedEndEpochTime: Date.now() + durationInMsToPlannedEndFromNow,
            expectedDurationInMs: rundownExpectedDurationInMs,
          }
          const rundown: Rundown = testEntityFactory.createRundown({ isActive: false, segments, timing })
          const partEntityService: PartEntityService = new PartEntityService()
          const testee: RundownTimingService = createTestee({ partEntityService: partEntityService })
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
          const segments: Segment[] = Array(numberOfSegments).map((_, index) =>
            testEntityFactory.createSegment({
              id: index.toString(),
              budgetDuration: rundownExpectedDurationInMs / numberOfSegments,
            })
          )
          const timing: RundownTiming = {
            type: RundownTimingType.BACKWARD,
            expectedEndEpochTime: Date.now() + durationInMsToPlannedEndFromNow,
            expectedDurationInMs: rundownExpectedDurationInMs,
          }
          const rundown: Rundown = testEntityFactory.createRundown({ isActive: false, segments, timing })
          const partEntityService: PartEntityService = new PartEntityService()
          const testee: RundownTimingService = createTestee({ partEntityService: partEntityService })
          const estimatedEndEpochTime: number = Date.now() + rundownExpectedDurationInMs
          const expectedResult: number = estimatedEndEpochTime - timing.expectedEndEpochTime

          const result: number = testee.getRundownScheduleOffsetInMs(rundown)

          expect(result).toBe(expectedResult)
        })
      })
    })

    describe('when rundown is active', () => {
      describe('when rundown has no segment on air', () => {
        describe('when rundown has no untimed segment', () => {
          it('returns the difference with remaining time being based on all subsequent segments from the start of the next segment', () => {
            const durationInMsToPlannedEndFromNow: number = 10_000
            const rundownExpectedDurationInMs: number = 30_000
            const numberOfSegments: number = 4
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const segments: Segment[] = [...Array(numberOfSegments)].map((_, index) =>
              testEntityFactory.createSegment({
                id: index.toString(),
                budgetDuration: rundownExpectedDurationInMs / numberOfSegments,
              })
            )
            const nextSegmentDuration: number = 2_000
            const nextSegment: Segment = testEntityFactory.createSegment({
              id: 'nextSegment',
              isNext: true,
              budgetDuration: nextSegmentDuration,
            })
            segments.unshift(nextSegment)
            const timing: RundownTiming = {
              type: RundownTimingType.BACKWARD,
              expectedEndEpochTime: Date.now() + durationInMsToPlannedEndFromNow,
              expectedDurationInMs: rundownExpectedDurationInMs,
            }
            const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments, timing })
            const partEntityService: PartEntityService = new PartEntityService()
            const testee: RundownTimingService = createTestee({ partEntityService: partEntityService })
            const estimateEndEpocTime: number = Date.now() + rundownExpectedDurationInMs + nextSegmentDuration
            const expectedResult: number = estimateEndEpocTime - timing.expectedEndEpochTime

            const result: number = testee.getRundownScheduleOffsetInMs(rundown)

            expect(result).toBe(expectedResult)
          })
        })
      })

      describe('when rundown has untimed segment', () => {
        it('returns the difference with remaining time being based on all subsequent segments between the start of the next segment and the last segment', () => {
          const durationInMsToPlannedEndFromNow: number = 12_000
          const rundownExpectedDurationInMs: number = 30_000
          const numberOfSegments: number = 5
          const testEntityFactory: TestEntityFactory = new TestEntityFactory()
          const segments: Segment[] = [...Array(numberOfSegments)].map((_, index) =>
            testEntityFactory.createSegment({
              id: index.toString(),
              budgetDuration: rundownExpectedDurationInMs / numberOfSegments,
            })
          )

          const nextSegmentDuration: number = 2_000
          const nextSegment: Segment = testEntityFactory.createSegment({
            id: 'nextSegment',
            isNext: true,
            budgetDuration: nextSegmentDuration,
          })
          segments.unshift(nextSegment)
          const untimedSegment: Segment = testEntityFactory.createSegment({ isUntimed: true, budgetDuration: 2_000 })
          segments.push(untimedSegment)

          const timing: RundownTiming = {
            type: RundownTimingType.BACKWARD,
            expectedEndEpochTime: Date.now() + durationInMsToPlannedEndFromNow,
            expectedDurationInMs: rundownExpectedDurationInMs,
          }
          const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments, timing })
          const partEntityService: PartEntityService = new PartEntityService()
          const testee: RundownTimingService = createTestee({ partEntityService: partEntityService })

          const estimateEndEpocTime: number = Date.now() + rundownExpectedDurationInMs + nextSegmentDuration
          const expectedResult: number = estimateEndEpocTime - timing.expectedEndEpochTime

          const result: number = testee.getRundownScheduleOffsetInMs(rundown)

          expect(result).toBe(expectedResult)
        })
      })
    })

    describe('when rundown has a segment on air', () => {
      describe('when rundown has no untimed segment', () => {
        describe('when next segment is before the on air segment', () => {
          it('return the difference starting from the segment with the next cursor', () => {
            const rundownExpectedDurationInMs: number = 30_000
            const numberOfSegments: number = 3
            const partsPerSegment: number = 2
            const expectedPartDurationInMs: number = rundownExpectedDurationInMs / (numberOfSegments * partsPerSegment)
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const playedDurationInMsForOnAirPart: number = expectedPartDurationInMs / 2
            const onAirPart: Part = testEntityFactory.createPart({
              isOnAir: true,
              expectedDuration: expectedPartDurationInMs,
              executedAt: Date.now(),
            })
            const nextSegment: Segment = testEntityFactory.createSegment({
              isNext: true,
              parts: [onAirPart],
              budgetDuration: expectedPartDurationInMs * partsPerSegment,
            })
            const onAirSegment: Segment = testEntityFactory.createSegment({
              isOnAir: true,
              parts: [onAirPart],
              budgetDuration: expectedPartDurationInMs * partsPerSegment,
            })
            const segments: Segment[] = [
              nextSegment,
              ...[...Array(numberOfSegments - 2)].map(() => testEntityFactory.createSegment({ budgetDuration: expectedPartDurationInMs * partsPerSegment })),
              onAirSegment,
            ]
            const timing: BackwardRundownTiming = {
              type: RundownTimingType.BACKWARD,
              expectedEndEpochTime: Date.now() + rundownExpectedDurationInMs,
              expectedDurationInMs: rundownExpectedDurationInMs,
            }
            const rundown: Rundown = testEntityFactory.createRundown({ timing, segments, isActive: true })
            const partEntityService: PartEntityService = new PartEntityService()
            const testee: RundownTimingService = createTestee({ partEntityService: partEntityService })
            const expectedResult: number = 0

            jasmine.clock().tick(playedDurationInMsForOnAirPart)

            const result: number = testee.getRundownScheduleOffsetInMs(rundown)

            expect(result).toBe(expectedResult)
          })
        })

        describe('when next segment is also the on air segment', () => {
          it('returns the difference using remaining time in on air/next segment and the rest of the rundown', () => {
            const rundownExpectedDurationInMs: number = 30_000
            const numberOfSegments: number = 3
            const partsPerSegment: number = 2
            const expectedPartDurationInMs: number = rundownExpectedDurationInMs / (numberOfSegments * partsPerSegment)
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const playedDurationInMsForOnAirPart: number = expectedPartDurationInMs / 2
            const onAirPart: Part = testEntityFactory.createPart({
              isOnAir: true,
              expectedDuration: expectedPartDurationInMs,
              executedAt: Date.now(),
            })
            const nextPart: Part = testEntityFactory.createPart({
              isNext: true,
              expectedDuration: expectedPartDurationInMs,
            })
            const onAirAndNextSegment: Segment = testEntityFactory.createSegment({
              isOnAir: true,
              isNext: true,
              parts: [onAirPart, nextPart],
              budgetDuration: expectedPartDurationInMs * partsPerSegment,
            })
            const segments: Segment[] = [
              onAirAndNextSegment,
              ...[...Array(numberOfSegments - 1)].map(() => testEntityFactory.createSegment({ budgetDuration: expectedPartDurationInMs * partsPerSegment })),
            ]
            const timing: BackwardRundownTiming = {
              type: RundownTimingType.BACKWARD,
              expectedEndEpochTime: Date.now() + rundownExpectedDurationInMs,
              expectedDurationInMs: rundownExpectedDurationInMs,
            }
            const rundown: Rundown = testEntityFactory.createRundown({ timing, segments, isActive: true })
            const partEntityService: PartEntityService = new PartEntityService()
            const testee: RundownTimingService = createTestee({ partEntityService: partEntityService })
            const expectedResult: number = 0

            jasmine.clock().tick(playedDurationInMsForOnAirPart)

            const result: number = testee.getRundownScheduleOffsetInMs(rundown)

            expect(result).toBe(expectedResult)
          })
        })

        describe('when next segment is after the on air segment', () => {
          it('return the difference using remaining onAir segment time and the rest of rundown segments from next segment', () => {
            const rundownExpectedDurationInMs: number = 30_000
            const numberOfSegments: number = 3
            const partsPerSegment: number = 2
            const expectedPartDurationInMs: number = rundownExpectedDurationInMs / (numberOfSegments * partsPerSegment)
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const playedDurationInMsForOnAirPart: number = expectedPartDurationInMs / 2
            const onAirPart: Part = testEntityFactory.createPart({
              isOnAir: true,
              expectedDuration: expectedPartDurationInMs,
              executedAt: Date.now(),
            })
            const nextSegment: Segment = testEntityFactory.createSegment({
              isNext: true,
              parts: [onAirPart],
              budgetDuration: expectedPartDurationInMs * partsPerSegment,
            })
            const onAirSegment: Segment = testEntityFactory.createSegment({
              isOnAir: true,
              parts: [onAirPart],
              budgetDuration: expectedPartDurationInMs * partsPerSegment,
            })
            const segments: Segment[] = [
              onAirSegment,
              nextSegment,
              ...[...Array(numberOfSegments - 2)].map(() => testEntityFactory.createSegment({ budgetDuration: expectedPartDurationInMs * partsPerSegment })),
            ]
            const timing: BackwardRundownTiming = {
              type: RundownTimingType.BACKWARD,
              expectedEndEpochTime: Date.now() + rundownExpectedDurationInMs,
              expectedDurationInMs: rundownExpectedDurationInMs,
            }
            const rundown: Rundown = testEntityFactory.createRundown({ timing, segments, isActive: true })
            const partEntityService: PartEntityService = new PartEntityService()
            const testee: RundownTimingService = createTestee({ partEntityService: partEntityService })
            const expectedResult: number = 0

            jasmine.clock().tick(playedDurationInMsForOnAirPart)

            const result: number = testee.getRundownScheduleOffsetInMs(rundown)

            expect(result).toBe(expectedResult)
          })
        })
      })

      describe('when rundown has untimed segment', () => {
        describe('when next segment is before the on air segment', () => {
          it('return the difference starting from the segment with the next cursor', () => {
            const rundownExpectedDurationInMs: number = 30_000
            const numberOfSegments: number = 3
            const partsPerSegment: number = 2
            const expectedPartDurationInMs: number = rundownExpectedDurationInMs / (numberOfSegments * partsPerSegment)
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const playedDurationInMsForOnAirPart: number = expectedPartDurationInMs / 2
            const onAirPart: Part = testEntityFactory.createPart({
              isOnAir: true,
              expectedDuration: expectedPartDurationInMs,
              executedAt: Date.now(),
            })
            const nextSegment: Segment = testEntityFactory.createSegment({
              isNext: true,
              parts: [onAirPart],
              budgetDuration: expectedPartDurationInMs * partsPerSegment,
            })
            const onAirSegment: Segment = testEntityFactory.createSegment({
              isOnAir: true,
              parts: [onAirPart],
              budgetDuration: expectedPartDurationInMs * partsPerSegment,
            })
            const untimedSegment: Segment = testEntityFactory.createSegment({ budgetDuration: 10_000, isUntimed: true })
            const segments: Segment[] = [
              nextSegment,
              ...[...Array(numberOfSegments - 2)].map(() => testEntityFactory.createSegment({ budgetDuration: expectedPartDurationInMs * partsPerSegment })),
              onAirSegment,
              untimedSegment,
            ]
            const timing: BackwardRundownTiming = {
              type: RundownTimingType.BACKWARD,
              expectedEndEpochTime: Date.now() + rundownExpectedDurationInMs,
              expectedDurationInMs: rundownExpectedDurationInMs,
            }
            const rundown: Rundown = testEntityFactory.createRundown({ timing, segments, isActive: true })
            const partEntityService: PartEntityService = new PartEntityService()
            const testee: RundownTimingService = createTestee({ partEntityService: partEntityService })
            const expectedResult: number = 0

            jasmine.clock().tick(playedDurationInMsForOnAirPart)

            const result: number = testee.getRundownScheduleOffsetInMs(rundown)

            expect(result).toBe(expectedResult)
          })

          describe('when next segment is the on air segment', () => {
            it('returns the difference using remaining time in on air/next segment and the rest of the rundown', () => {
              const rundownExpectedDurationInMs: number = 30_000
              const numberOfSegments: number = 3
              const partsPerSegment: number = 2
              const expectedPartDurationInMs: number = rundownExpectedDurationInMs / (numberOfSegments * partsPerSegment)
              const testEntityFactory: TestEntityFactory = new TestEntityFactory()
              const playedDurationInMsForOnAirPart: number = expectedPartDurationInMs / 2
              const onAirPart: Part = testEntityFactory.createPart({
                isOnAir: true,
                expectedDuration: expectedPartDurationInMs,
                executedAt: Date.now(),
              })
              const onAirAndNextSegment: Segment = testEntityFactory.createSegment({
                isOnAir: true,
                isNext: true,
                parts: [onAirPart],
                budgetDuration: expectedPartDurationInMs * partsPerSegment,
              })
              const untimedSegment: Segment = testEntityFactory.createSegment({ budgetDuration: 10_000, isUntimed: true })
              const segments: Segment[] = [
                onAirAndNextSegment,
                ...[...Array(numberOfSegments - 1)].map(() => testEntityFactory.createSegment({ budgetDuration: expectedPartDurationInMs * partsPerSegment })),
                untimedSegment,
              ]
              const timing: BackwardRundownTiming = {
                type: RundownTimingType.BACKWARD,
                expectedEndEpochTime: Date.now() + rundownExpectedDurationInMs,
                expectedDurationInMs: rundownExpectedDurationInMs,
              }
              const rundown: Rundown = testEntityFactory.createRundown({ timing, segments, isActive: true })
              const partEntityService: PartEntityService = new PartEntityService()
              const testee: RundownTimingService = createTestee({ partEntityService: partEntityService })
              const expectedResult: number = 0

              jasmine.clock().tick(playedDurationInMsForOnAirPart)

              const result: number = testee.getRundownScheduleOffsetInMs(rundown)

              expect(result).toBe(expectedResult)
            })
          })

          describe('when next segment is after the on air segment', () => {
            it('return the difference using remaining onAir segment time and the rest of rundown segments from next segment', () => {
              const rundownExpectedDurationInMs: number = 30_000
              const numberOfSegments: number = 3
              const partsPerSegment: number = 2
              const expectedPartDurationInMs: number = rundownExpectedDurationInMs / (numberOfSegments * partsPerSegment)
              const testEntityFactory: TestEntityFactory = new TestEntityFactory()
              const playedDurationInMsForOnAirPart: number = expectedPartDurationInMs / 2
              const onAirPart: Part = testEntityFactory.createPart({
                isOnAir: true,
                expectedDuration: expectedPartDurationInMs,
                executedAt: Date.now(),
              })
              const nextSegment: Segment = testEntityFactory.createSegment({
                isNext: true,
                parts: [onAirPart],
                budgetDuration: expectedPartDurationInMs * partsPerSegment,
              })
              const onAirSegment: Segment = testEntityFactory.createSegment({
                isOnAir: true,
                parts: [onAirPart],
                budgetDuration: expectedPartDurationInMs * partsPerSegment,
              })
              const untimedSegment: Segment = testEntityFactory.createSegment({ budgetDuration: 10_000, isUntimed: true })
              const segments: Segment[] = [
                onAirSegment,
                nextSegment,
                ...[...Array(numberOfSegments - 2)].map(() => testEntityFactory.createSegment({ budgetDuration: expectedPartDurationInMs * partsPerSegment })),
                untimedSegment,
              ]
              const timing: BackwardRundownTiming = {
                type: RundownTimingType.BACKWARD,
                expectedEndEpochTime: Date.now() + rundownExpectedDurationInMs,
                expectedDurationInMs: rundownExpectedDurationInMs,
              }
              const rundown: Rundown = testEntityFactory.createRundown({ timing, segments, isActive: true })
              const partEntityService: PartEntityService = new PartEntityService()
              const testee: RundownTimingService = createTestee({ partEntityService: partEntityService })
              const expectedResult: number = 0

              jasmine.clock().tick(playedDurationInMsForOnAirPart)

              const result: number = testee.getRundownScheduleOffsetInMs(rundown)

              expect(result).toBe(expectedResult)
            })
          })
        })
      })
    })
  })

  describe(RundownTimingService.prototype.getExpectedDurationInMsForSegment.name, () => {
    describe('when segment is untimed', () => {
      const isUntimed: boolean = true

      describe('when segment has an expected duration set', () => {
        const expectedDurationInMsForSegment: number = 3456

        describe('when segment has no parts', () => {
          it('returns 0', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts: [], budgetDuration: expectedDurationInMsForSegment })
            const testee: RundownTimingService = createTestee()

            const result: number = testee.getExpectedDurationInMsForSegment(segment)

            expect(result).toBe(0)
          })
        })

        describe('when segment has parts without an expected duration', () => {
          it('returns 0', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const parts: Part[] = [
              testEntityFactory.createPart({ expectedDuration: 1000 }),
              testEntityFactory.createPart({ expectedDuration: undefined }),
              testEntityFactory.createPart({ expectedDuration: 1000 }),
            ]
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, budgetDuration: expectedDurationInMsForSegment })
            const testee: RundownTimingService = createTestee()

            const result: number = testee.getExpectedDurationInMsForSegment(segment)

            expect(result).toBe(0)
          })
        })

        describe('when segment has no parts with an expected duration', () => {
          it('returns 0', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const parts: Part[] = [
              testEntityFactory.createPart({ expectedDuration: undefined }),
              testEntityFactory.createPart({ expectedDuration: undefined }),
              testEntityFactory.createPart({ expectedDuration: undefined }),
            ]
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, budgetDuration: expectedDurationInMsForSegment })
            const testee: RundownTimingService = createTestee()

            const result: number = testee.getExpectedDurationInMsForSegment(segment)

            expect(result).toBe(0)
          })
        })

        describe('when segment only has parts with an expected duration', () => {
          it('returns 0', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const parts: Part[] = [
              testEntityFactory.createPart({ expectedDuration: 1000 }),
              testEntityFactory.createPart({ expectedDuration: 2000 }),
              testEntityFactory.createPart({ expectedDuration: 3000 }),
            ]
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, budgetDuration: expectedDurationInMsForSegment })
            const testee: RundownTimingService = createTestee()

            const result: number = testee.getExpectedDurationInMsForSegment(segment)

            expect(result).toBe(0)
          })
        })
      })

      describe('when segment has no expected duration set', () => {
        const expectedDurationInMsForSegment: undefined = undefined

        describe('when segment has no parts', () => {
          it('returns 0', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts: [], budgetDuration: expectedDurationInMsForSegment })
            const testee: RundownTimingService = createTestee()

            const result: number = testee.getExpectedDurationInMsForSegment(segment)

            expect(result).toBe(0)
          })
        })

        describe('when segment has parts without an expected duration', () => {
          it('returns 0', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const parts: Part[] = [
              testEntityFactory.createPart({ expectedDuration: 1000 }),
              testEntityFactory.createPart({ expectedDuration: undefined }),
              testEntityFactory.createPart({ expectedDuration: 1000 }),
            ]
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, budgetDuration: expectedDurationInMsForSegment })
            const testee: RundownTimingService = createTestee()

            const result: number = testee.getExpectedDurationInMsForSegment(segment)

            expect(result).toBe(0)
          })
        })

        describe('when segment has no parts with an expected duration', () => {
          it('returns 0', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const parts: Part[] = [
              testEntityFactory.createPart({ expectedDuration: undefined }),
              testEntityFactory.createPart({ expectedDuration: undefined }),
              testEntityFactory.createPart({ expectedDuration: undefined }),
            ]
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, budgetDuration: expectedDurationInMsForSegment })
            const testee: RundownTimingService = createTestee()

            const result: number = testee.getExpectedDurationInMsForSegment(segment)

            expect(result).toBe(0)
          })
        })

        describe('when segment only has parts with an expected duration', () => {
          it('returns 0', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const parts: Part[] = [
              testEntityFactory.createPart({ expectedDuration: 1000 }),
              testEntityFactory.createPart({ expectedDuration: 2000 }),
              testEntityFactory.createPart({ expectedDuration: 3000 }),
            ]
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, budgetDuration: expectedDurationInMsForSegment })
            const testee: RundownTimingService = createTestee()

            const result: number = testee.getExpectedDurationInMsForSegment(segment)

            expect(result).toBe(0)
          })
        })
      })
    })

    describe('when segment is timed', () => {
      const isUntimed: boolean = false

      describe('when segment has an expected duration set', () => {
        const expectedDurationInMsForSegment: number = 3456

        describe('when segment has no parts', () => {
          it('returns 0', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts: [], budgetDuration: expectedDurationInMsForSegment })
            const testee: RundownTimingService = createTestee()

            const result: number = testee.getExpectedDurationInMsForSegment(segment)

            expect(result).toBe(expectedDurationInMsForSegment)
          })
        })

        describe('when segment has parts without an expected duration', () => {
          it('returns 0', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const parts: Part[] = [
              testEntityFactory.createPart({ expectedDuration: 1000 }),
              testEntityFactory.createPart({ expectedDuration: undefined }),
              testEntityFactory.createPart({ expectedDuration: 1000 }),
            ]
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, budgetDuration: expectedDurationInMsForSegment })
            const testee: RundownTimingService = createTestee()

            const result: number = testee.getExpectedDurationInMsForSegment(segment)

            expect(result).toBe(expectedDurationInMsForSegment)
          })
        })

        describe('when segment has no parts with an expected duration', () => {
          it('returns 0', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const parts: Part[] = [
              testEntityFactory.createPart({ expectedDuration: undefined }),
              testEntityFactory.createPart({ expectedDuration: undefined }),
              testEntityFactory.createPart({ expectedDuration: undefined }),
            ]
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, budgetDuration: expectedDurationInMsForSegment })
            const testee: RundownTimingService = createTestee()

            const result: number = testee.getExpectedDurationInMsForSegment(segment)

            expect(result).toBe(expectedDurationInMsForSegment)
          })
        })

        describe('when segment only has parts with an expected duration', () => {
          it('returns 0', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const parts: Part[] = [
              testEntityFactory.createPart({ expectedDuration: 1000 }),
              testEntityFactory.createPart({ expectedDuration: 2000 }),
              testEntityFactory.createPart({ expectedDuration: 3000 }),
            ]
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, budgetDuration: expectedDurationInMsForSegment })
            const testee: RundownTimingService = createTestee()

            const result: number = testee.getExpectedDurationInMsForSegment(segment)

            expect(result).toBe(expectedDurationInMsForSegment)
          })
        })
      })

      describe('when segment has no expected duration set', () => {
        const expectedDurationInMsForSegment: undefined = undefined

        describe('when segment has no parts', () => {
          it('returns 0', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts: [], budgetDuration: expectedDurationInMsForSegment })
            const testee: RundownTimingService = createTestee()

            const result: number = testee.getExpectedDurationInMsForSegment(segment)

            expect(result).toBe(0)
          })
        })

        describe('when segment has parts without an expected duration', () => {
          it('returns 0', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const parts: Part[] = [
              testEntityFactory.createPart({ expectedDuration: 1000 }),
              testEntityFactory.createPart({ expectedDuration: undefined }),
              testEntityFactory.createPart({ expectedDuration: 1000 }),
            ]
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, budgetDuration: expectedDurationInMsForSegment })
            const testee: RundownTimingService = createTestee()

            const result: number = testee.getExpectedDurationInMsForSegment(segment)

            expect(result).toBe(2000)
          })
        })

        describe('when segment has no parts with an expected duration', () => {
          it('returns 0', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const parts: Part[] = [
              testEntityFactory.createPart({ expectedDuration: undefined }),
              testEntityFactory.createPart({ expectedDuration: undefined }),
              testEntityFactory.createPart({ expectedDuration: undefined }),
            ]
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, budgetDuration: expectedDurationInMsForSegment })
            const testee: RundownTimingService = createTestee()

            const result: number = testee.getExpectedDurationInMsForSegment(segment)

            expect(result).toBe(0)
          })
        })

        describe('when segment only has parts with an expected duration', () => {
          it('returns 0', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const parts: Part[] = [
              testEntityFactory.createPart({ expectedDuration: 1000 }),
              testEntityFactory.createPart({ expectedDuration: 2000 }),
              testEntityFactory.createPart({ expectedDuration: 3000 }),
            ]
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, budgetDuration: expectedDurationInMsForSegment })
            const testee: RundownTimingService = createTestee()

            const result: number = testee.getExpectedDurationInMsForSegment(segment)

            expect(result).toBe(6000)
          })
        })
      })
    })
  })

  describe(RundownTimingService.prototype.getExpectedDurationInMsForRundown.name, () => {
    describe('when rundown has expected duration set', () => {
      const expectedDurationInMsForRundown: number = 50000
      const timing: RundownTiming = {
        type: RundownTimingType.BACKWARD,
        expectedDurationInMs: expectedDurationInMsForRundown,
        expectedEndEpochTime: Number.POSITIVE_INFINITY,
      }
      const expectedDurationsInMsForSegments: Record<string, number> = {
        'segmentA': 100,
        'segmentB': 110,
        'segmentC': 120,
        'segmentD': 130,
      }

      describe('when all segments have a cached expected duration', () => {
        it('returns the set expected duration for the rundown', () => {
          const segments: Segment[] = [
            testEntityFactory.createSegment({ id: 'segmentA' }),
            testEntityFactory.createSegment({ id: 'segmentB' }),
            testEntityFactory.createSegment({ id: 'segmentC' }),
            testEntityFactory.createSegment({ id: 'segmentD' }),
          ]
          const rundown: Rundown = testEntityFactory.createRundown({ segments, timing })
          const testee: RundownTimingService = createTestee()

          const result: number = testee.getExpectedDurationInMsForRundown(rundown, expectedDurationsInMsForSegments)

          expect(result).toBe(expectedDurationInMsForRundown)
        })
      })

      describe('when no segments have a cached expected duration', () => {
        it('returns the set expected duration for the rundown', () => {
          const segments: Segment[] = [
            testEntityFactory.createSegment({id: 'segmentH'}),
            testEntityFactory.createSegment({id: 'segmentJ'}),
            testEntityFactory.createSegment({id: 'segmentK'}),
            testEntityFactory.createSegment({id: 'segmentL'}),
          ]
          const rundown: Rundown = testEntityFactory.createRundown({segments, timing})
          const testee: RundownTimingService = createTestee()

          const result: number = testee.getExpectedDurationInMsForRundown(rundown, expectedDurationsInMsForSegments)

          expect(result).toBe(expectedDurationInMsForRundown)
        })
      })
    })

    describe('when rundown has no expected duration', () => {
      const timing: RundownTiming = {
        type: RundownTimingType.BACKWARD,
        expectedEndEpochTime: Number.POSITIVE_INFINITY,
      }
      const expectedDurationsInMsForSegments: Record<string, number> = {
        'segmentA': 100,
        'segmentB': 110,
        'segmentC': 120,
        'segmentD': 130,
      }

      describe('when all segments have a cached expected duration', () => {
        it('returns the sum of expected durations for the segments', () => {
          const segments: Segment[] = [
            testEntityFactory.createSegment({ id: 'segmentA' }),
            testEntityFactory.createSegment({ id: 'segmentB' }),
            testEntityFactory.createSegment({ id: 'segmentC' }),
            testEntityFactory.createSegment({ id: 'segmentD' }),
          ]
          const rundown: Rundown = testEntityFactory.createRundown({ segments, timing })
          const testee: RundownTimingService = createTestee()

          const result: number = testee.getExpectedDurationInMsForRundown(rundown, expectedDurationsInMsForSegments)

          expect(result).toBe(460)
        })
      })

      describe('when no segments have a cached expected duration', () => {
        it('returns 0', () => {
          const segments: Segment[] = [
            testEntityFactory.createSegment({id: 'segmentH'}),
            testEntityFactory.createSegment({id: 'segmentJ'}),
            testEntityFactory.createSegment({id: 'segmentK'}),
            testEntityFactory.createSegment({id: 'segmentL'}),
          ]
          const rundown: Rundown = testEntityFactory.createRundown({segments, timing})
          const testee: RundownTimingService = createTestee()

          const result: number = testee.getExpectedDurationInMsForRundown(rundown, expectedDurationsInMsForSegments)

          expect(result).toBe(0)
        })
      })
    })
  })
})

function createTestee(params: { partEntityService?: PartEntityService } = {}): RundownTimingService {
  const partEntityService: PartEntityService = params.partEntityService ?? instance(mock<PartEntityService>())
  return new RundownTimingService(partEntityService)
}
