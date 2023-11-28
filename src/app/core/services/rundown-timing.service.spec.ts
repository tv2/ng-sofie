import { RundownTimingService } from './rundown-timing.service'
import { Rundown } from '../models/rundown'
import { TestEntityFactory } from '../../test/factories/test-entity.factory'
import { BackwardRundownTiming, ForwardRundownTiming, RundownTiming, UnscheduledRundownTiming } from '../models/rundown-timing'
import { Segment } from '../models/segment'
import { RundownTimingType } from '../enums/rundown-timing-type'
import { Part } from '../models/part'
import { PartEntityService } from './models/part-entity.service'
import { anyNumber, anything, instance, mock, when } from '@typestrong/ts-mockito'

describe(RundownTimingService.name, () => {
  const testEntityFactory: TestEntityFactory = new TestEntityFactory()

  beforeEach(() => {
    jasmine.clock().install()
    jasmine.clock().mockDate(new Date())
  })
  afterEach(() => jasmine.clock().uninstall())

  describe(RundownTimingService.prototype.getExpectedDurationInMsForSegment.name, () => {
    describe('when segment is untimed', () => {
      const isUntimed: boolean = true

      describe('when segment has an expected duration set', () => {
        const expectedDurationInMsForSegment: number = 3456

        describe('when segment has no parts', () => {
          it('returns 0', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts: [], expectedDurationInMs: expectedDurationInMsForSegment })
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
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, expectedDurationInMs: expectedDurationInMsForSegment })
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
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, expectedDurationInMs: expectedDurationInMsForSegment })
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
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, expectedDurationInMs: expectedDurationInMsForSegment })
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
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts: [], expectedDurationInMs: expectedDurationInMsForSegment })
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
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, expectedDurationInMs: expectedDurationInMsForSegment })
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
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, expectedDurationInMs: expectedDurationInMsForSegment })
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
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, expectedDurationInMs: expectedDurationInMsForSegment })
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
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts: [], expectedDurationInMs: expectedDurationInMsForSegment })
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
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, expectedDurationInMs: expectedDurationInMsForSegment })
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
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, expectedDurationInMs: expectedDurationInMsForSegment })
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
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, expectedDurationInMs: expectedDurationInMsForSegment })
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
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts: [], expectedDurationInMs: expectedDurationInMsForSegment })
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
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, expectedDurationInMs: expectedDurationInMsForSegment })
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
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, expectedDurationInMs: expectedDurationInMsForSegment })
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
            const segment: Segment = testEntityFactory.createSegment({ isUntimed, parts, expectedDurationInMs: expectedDurationInMsForSegment })
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
        segmentA: 100,
        segmentB: 110,
        segmentC: 120,
        segmentD: 130,
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
            testEntityFactory.createSegment({ id: 'segmentH' }),
            testEntityFactory.createSegment({ id: 'segmentJ' }),
            testEntityFactory.createSegment({ id: 'segmentK' }),
            testEntityFactory.createSegment({ id: 'segmentL' }),
          ]
          const rundown: Rundown = testEntityFactory.createRundown({ segments, timing })
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
        segmentA: 100,
        segmentB: 110,
        segmentC: 120,
        segmentD: 130,
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
            testEntityFactory.createSegment({ id: 'segmentH' }),
            testEntityFactory.createSegment({ id: 'segmentJ' }),
            testEntityFactory.createSegment({ id: 'segmentK' }),
            testEntityFactory.createSegment({ id: 'segmentL' }),
          ]
          const rundown: Rundown = testEntityFactory.createRundown({ segments, timing })
          const testee: RundownTimingService = createTestee()

          const result: number = testee.getExpectedDurationInMsForRundown(rundown, expectedDurationsInMsForSegments)

          expect(result).toBe(0)
        })
      })
    })
  })

  describe(RundownTimingService.prototype.getExpectedStartEpochTimeForRundown.name, () => {
    describe('when rundown has forward timing', () => {
      it('returns the set expected start epoch time', () => {
        const currentEpochTime: number = Date.now()
        const expectedStartEpochTime: number = currentEpochTime + 1000
        const timing: ForwardRundownTiming = {
          type: RundownTimingType.FORWARD,
          expectedStartEpochTime,
        }
        const rundown: Rundown = testEntityFactory.createRundown({ timing })
        const testee: RundownTimingService = createTestee()

        const result: number = testee.getExpectedStartEpochTimeForRundown(rundown, 0, currentEpochTime)

        expect(result).toBe(expectedStartEpochTime)
      })
    })

    describe('when rundown has backward timing', () => {
      const currentEpochTime: number = Date.now()
      const expectedEndEpochTime: number = currentEpochTime + 10000

      describe('when the expected start epoch time is set', () => {
        it('returns the expected start epoch time', () => {
          const expectedStartEpochTime: number = currentEpochTime + 1000
          const timing: BackwardRundownTiming = {
            type: RundownTimingType.BACKWARD,
            expectedStartEpochTime,
            expectedEndEpochTime,
          }
          const rundown: Rundown = testEntityFactory.createRundown({ timing })
          const testee: RundownTimingService = createTestee()

          const result: number = testee.getExpectedStartEpochTimeForRundown(rundown, 0, currentEpochTime)

          expect(result).toBe(expectedStartEpochTime)
        })
      })

      describe('when the expected start epoch time is not set', () => {
        it('returns the epoch time subtracted the expected duration', () => {
          const timing: BackwardRundownTiming = {
            type: RundownTimingType.BACKWARD,
            expectedEndEpochTime,
          }
          const expectedDurationInMs: number = 5000
          const rundown: Rundown = testEntityFactory.createRundown({ timing })
          const testee: RundownTimingService = createTestee()

          const result: number = testee.getExpectedStartEpochTimeForRundown(rundown, expectedDurationInMs, currentEpochTime)

          expect(result).toBe(expectedEndEpochTime - expectedDurationInMs)
        })
      })
    })

    describe('when rundown has unscheduled timing', () => {
      it('returns the current epoch time', () => {
        const currentEpochTime: number = Date.now()
        const timing: UnscheduledRundownTiming = {
          type: RundownTimingType.UNSCHEDULED,
        }
        const rundown: Rundown = testEntityFactory.createRundown({ timing })
        const testee: RundownTimingService = createTestee()

        const result: number = testee.getExpectedStartEpochTimeForRundown(rundown, 0, currentEpochTime)

        expect(result).toBe(currentEpochTime)
      })
    })
  })

  describe(RundownTimingService.prototype.getExpectedEndEpochTimeForRundown.name, () => {
    const currentEpochTime: number = Date.now()
    const expectedDurationInMsForRundown: number = 4000

    describe('when rundown has backward timing', () => {
      it('returns the expected end epoch time', () => {
        const expectedEndEpochTime: number = currentEpochTime + 40000
        const timing: BackwardRundownTiming = {
          type: RundownTimingType.BACKWARD,
          expectedEndEpochTime,
        }
        const rundown: Rundown = testEntityFactory.createRundown({ timing })
        const testee: RundownTimingService = createTestee()

        const result: number = testee.getExpectedEndEpochTimeForRundown(rundown, expectedDurationInMsForRundown, currentEpochTime)

        expect(result).toBe(expectedEndEpochTime)
      })
    })

    describe('when rundown has forward timing', () => {
      const expectedStartEpochTime: number = currentEpochTime + 1000
      describe('when the expected end epoch time is set', () => {
        it('returns the expected end epoch time', () => {
          const expectedEndEpochTime: number = currentEpochTime + 40000
          const timing: ForwardRundownTiming = {
            type: RundownTimingType.FORWARD,
            expectedStartEpochTime,
            expectedEndEpochTime,
          }
          const rundown: Rundown = testEntityFactory.createRundown({ timing })
          const testee: RundownTimingService = createTestee()

          const result: number = testee.getExpectedEndEpochTimeForRundown(rundown, expectedDurationInMsForRundown, currentEpochTime)

          expect(result).toBe(expectedEndEpochTime)
        })
      })

      describe('when the expected end epoch time is not set', () => {
        it('returns the sum of the expected start epoch time and the expected duration', () => {
          const timing: ForwardRundownTiming = {
            type: RundownTimingType.FORWARD,
            expectedStartEpochTime,
          }
          const rundown: Rundown = testEntityFactory.createRundown({ timing })
          const testee: RundownTimingService = createTestee()

          const result: number = testee.getExpectedEndEpochTimeForRundown(rundown, expectedDurationInMsForRundown, currentEpochTime)

          expect(result).toBe(expectedStartEpochTime + expectedDurationInMsForRundown)
        })
      })
    })

    describe('when rundown has unscheduled timing', () => {
      it('returns the sum of the current epoch time and the expected duration', () => {
        const timing: UnscheduledRundownTiming = {
          type: RundownTimingType.UNSCHEDULED,
        }
        const rundown: Rundown = testEntityFactory.createRundown({ timing })
        const testee: RundownTimingService = createTestee()

        const result: number = testee.getExpectedEndEpochTimeForRundown(rundown, expectedDurationInMsForRundown, currentEpochTime)

        expect(result).toBe(currentEpochTime + expectedDurationInMsForRundown)
      })
    })
  })

  describe(RundownTimingService.prototype.getPlayedDurationInMsForOnAirPart.name, () => {
    describe('when rundown has no part on air', () => {
      it('returns 0', () => {
        const rundown: Rundown = testEntityFactory.createRundown({ segments: [] })
        const testee: RundownTimingService = createTestee()

        const result: number = testee.getPlayedDurationInMsForOnAirPart(rundown, Date.now())

        expect(result).toBe(0)
      })
    })

    describe('when rundown has part on air', () => {
      describe('when on air part is timed', () => {
        it('returns the aggregated played duration for the part', () => {
          const playedDurationInMsForOnAirPart: number = 123456
          const onAirPart: Part = testEntityFactory.createPart({ isOnAir: true })
          const onAirSegment: Segment = testEntityFactory.createSegment({ isOnAir: true, parts: [onAirPart] })
          const mockedPartEntityService: PartEntityService = mock<PartEntityService>()
          when(mockedPartEntityService.getPlayedDuration(onAirPart, anyNumber())).thenReturn(playedDurationInMsForOnAirPart)
          const rundown: Rundown = testEntityFactory.createRundown({ segments: [onAirSegment] })
          const testee: RundownTimingService = createTestee({ partEntityService: instance(mockedPartEntityService) })

          const result: number = testee.getPlayedDurationInMsForOnAirPart(rundown, Date.now())

          expect(result).toBe(playedDurationInMsForOnAirPart)
        })
      })

      describe('when on air part is untimed', () => {
        it('returns 0', () => {
          const playedDurationInMsForOnAirPart: number = 123456
          const onAirPart: Part = testEntityFactory.createPart({ isOnAir: true, isUntimed: true })
          const onAirSegment: Segment = testEntityFactory.createSegment({ isOnAir: true, parts: [onAirPart] })
          const mockedPartEntityService: PartEntityService = mock<PartEntityService>()
          when(mockedPartEntityService.getPlayedDuration(onAirPart, anyNumber())).thenReturn(playedDurationInMsForOnAirPart)
          const rundown: Rundown = testEntityFactory.createRundown({ segments: [onAirSegment] })
          const testee: RundownTimingService = createTestee({ partEntityService: instance(mockedPartEntityService) })

          const result: number = testee.getPlayedDurationInMsForOnAirPart(rundown, Date.now())

          expect(result).toBe(0)
        })
      })
    })
  })

  describe(RundownTimingService.prototype.getPlayedDurationInMsForOnAirSegment.name, () => {
    describe('when rundown has no on air segment', () => {
      it('returns 0', () => {
        const rundown: Rundown = testEntityFactory.createRundown({ segments: [] })
        const testee: RundownTimingService = createTestee()

        const result: number = testee.getPlayedDurationInMsForOnAirSegment(rundown, Date.now())

        expect(result).toBe(0)
      })
    })

    describe('when rundown has on air segment', () => {
      it('returns the sum of the part durations prior to the on air part and the played duration for the on air part ', () => {
        const executedAtEpochTimeForOnAirPart: number = Date.now()
        const playedDurationForOnAirPart: number = 3000
        const parts: Part[] = [
          testEntityFactory.createPart({ expectedDuration: 1000 }),
          testEntityFactory.createPart({ expectedDuration: undefined }),
          testEntityFactory.createPart({ isOnAir: true, expectedDuration: undefined, executedAt: executedAtEpochTimeForOnAirPart }),
        ]
        const onAirSegment: Segment = testEntityFactory.createSegment({ isOnAir: true, parts })
        const rundown: Rundown = testEntityFactory.createRundown({ segments: [onAirSegment] })
        const mockedPartEntityService: PartEntityService = mock<PartEntityService>()
        when(mockedPartEntityService.getPlayedDuration(anything(), anyNumber())).thenReturn(playedDurationForOnAirPart)
        when(mockedPartEntityService.getDuration(anything(), anyNumber())).thenCall(part => part.expectedDuration ?? 4000)
        const testee: RundownTimingService = createTestee({ partEntityService: instance(mockedPartEntityService) })
        jasmine.clock().tick(playedDurationForOnAirPart)

        const result: number = testee.getPlayedDurationInMsForOnAirSegment(rundown, Date.now())

        expect(result).toBe(8000)
      })
    })
  })

  describe(RundownTimingService.prototype.getDurationInMsSpentInOnAirSegment.name, () => {
    describe('when rundown has no on air segment', () => {
      it('returns 0', () => {
        const rundown: Rundown = testEntityFactory.createRundown({ segments: [] })
        const currentEpochTime: number = Date.now()
        const testee: RundownTimingService = createTestee()

        const result: number = testee.getDurationInMsSpentInOnAirSegment(rundown, currentEpochTime)

        expect(result).toBe(0)
      })
    })

    describe('when rundown has an on air segment', () => {
      it('returns the duration from current epoch time to the epoch time that the segment was executed', () => {
        const currentEpochTime: number = Date.now()
        const durationInMsSpentInOnAirSegment: number = 5000
        const executedAtEpochTime: number = currentEpochTime - durationInMsSpentInOnAirSegment
        const onAirSegment: Segment = testEntityFactory.createSegment({ isOnAir: true, executedAtEpochTime })
        const rundown: Rundown = testEntityFactory.createRundown({ segments: [onAirSegment] })
        const testee: RundownTimingService = createTestee()

        const result: number = testee.getDurationInMsSpentInOnAirSegment(rundown, currentEpochTime)

        expect(result).toBe(durationInMsSpentInOnAirSegment)
      })
    })
  })

  describe(RundownTimingService.prototype.getRemainingDurationInMsForRundown.name, () => {
    const expectedDurationsInMsForSegments: Record<string, number> = {
      segmentA: 100,
      segmentB: 110,
      segmentC: 120,
      segmentD: 130,
    }

    describe('when rundown is inactive', () => {
      it('returns 0', () => {
        const segments: Segment[] = [testEntityFactory.createSegment({ id: 'segmentA' }), testEntityFactory.createSegment({ id: 'segmentB' })]
        const rundown: Rundown = testEntityFactory.createRundown({ isActive: false, segments })
        const testee: RundownTimingService = createTestee()

        const result: number = testee.getRemainingDurationInMsForRundown(rundown, expectedDurationsInMsForSegments, 0)

        expect(result).toBe(0)
      })
    })

    describe('when rundown has an on air segment', () => {
      describe('when the on air segment is marked as next', () => {
        it('returns the sum of expected durations for consecutive segments after the on air segment and the remaining duration for the on air segment', () => {
          const playedDurationInMsForOnAirSegment: number = 50
          const onAirAndNextSegment: Segment = testEntityFactory.createSegment({ id: 'segmentA', isOnAir: true, isNext: true })
          const segments: Segment[] = [onAirAndNextSegment, testEntityFactory.createSegment({ id: 'segmentB' })]
          const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments })
          const testee: RundownTimingService = createTestee()
          const expectedResult: number = expectedDurationsInMsForSegments['segmentB'] + expectedDurationsInMsForSegments['segmentA'] - playedDurationInMsForOnAirSegment

          const result: number = testee.getRemainingDurationInMsForRundown(rundown, expectedDurationsInMsForSegments, playedDurationInMsForOnAirSegment)

          expect(result).toBe(expectedResult)
        })
      })

      describe('when an segment marked as next is placed before the on air segment', () => {
        it('returns the sum of the expected durations for the consecutive segments form the segment marked as next, without the on air segment, and the remaining duration for the on air segment', () => {
          const playedDurationInMsForOnAirSegment: number = 50
          const onAirAndNextSegment: Segment = testEntityFactory.createSegment({ id: 'segmentA', isOnAir: true })
          const segments: Segment[] = [testEntityFactory.createSegment({ id: 'segmentC', isNext: true }), onAirAndNextSegment, testEntityFactory.createSegment({ id: 'segmentB' })]
          const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments })
          const testee: RundownTimingService = createTestee()
          const expectedResult: number =
            expectedDurationsInMsForSegments['segmentB'] + +expectedDurationsInMsForSegments['segmentC'] + expectedDurationsInMsForSegments['segmentA'] - playedDurationInMsForOnAirSegment

          const result: number = testee.getRemainingDurationInMsForRundown(rundown, expectedDurationsInMsForSegments, playedDurationInMsForOnAirSegment)

          expect(result).toBe(expectedResult)
        })
      })

      describe('when an segment marked as next is placed after the on air segment', () => {
        it('returns the sum of expected durations for consecutive segments from the on air segment and the remaining duration for the on air segment', () => {
          const playedDurationInMsForOnAirSegment: number = 50
          const onAirAndNextSegment: Segment = testEntityFactory.createSegment({ id: 'segmentA', isOnAir: true })
          const segments: Segment[] = [
            onAirAndNextSegment,
            testEntityFactory.createSegment({ id: 'segmentB' }),
            testEntityFactory.createSegment({ id: 'segmentC', isNext: true }),
            testEntityFactory.createSegment({ id: 'segmentD' }),
          ]
          const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments })
          const testee: RundownTimingService = createTestee()
          const expectedResult: number =
            expectedDurationsInMsForSegments['segmentC'] + +expectedDurationsInMsForSegments['segmentD'] + expectedDurationsInMsForSegments['segmentA'] - playedDurationInMsForOnAirSegment

          const result: number = testee.getRemainingDurationInMsForRundown(rundown, expectedDurationsInMsForSegments, playedDurationInMsForOnAirSegment)

          expect(result).toBe(expectedResult)
        })
      })
    })

    describe('when rundown has a segment marked as next', () => {
      describe('when rundown has no segment on air', () => {
        it('returns the sum of expected durations for consecutive segments from the segment marked as next', () => {
          const playedDurationInMsForOnAirSegment: number = 50
          const segments: Segment[] = [
            testEntityFactory.createSegment({ id: 'segmentB' }),
            testEntityFactory.createSegment({ id: 'segmentC', isNext: true }),
            testEntityFactory.createSegment({ id: 'segmentD' }),
          ]
          const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments })
          const testee: RundownTimingService = createTestee()
          const expectedResult: number = expectedDurationsInMsForSegments['segmentC'] + +expectedDurationsInMsForSegments['segmentD']

          const result: number = testee.getRemainingDurationInMsForRundown(rundown, expectedDurationsInMsForSegments, playedDurationInMsForOnAirSegment)

          expect(result).toBe(expectedResult)
        })
      })
    })
  })

  describe(RundownTimingService.prototype.getStartOffsetsInMsFromNextCursorForSegments.name, () => {
    const expectedDurationsInMsForSegments: Record<string, number> = {
      segmentA: 1000,
      segmentB: 2000,
      segmentC: 3000,
      segmentD: 4000,
    }
    describe('when rundown is inactive', () => {
      it('returns entries for all segments', () => {
        const segments: Segment[] = [
          testEntityFactory.createSegment({ id: 'segmentA' }),
          testEntityFactory.createSegment({ id: 'segmentB' }),
          testEntityFactory.createSegment({ id: 'segmentC' }),
          testEntityFactory.createSegment({ id: 'segmentD' }),
        ]

        const rundown: Rundown = testEntityFactory.createRundown({ segments })
        const testee: RundownTimingService = createTestee()

        const result: Record<string, number> = testee.getStartOffsetsInMsFromNextCursorForSegments(rundown, expectedDurationsInMsForSegments)

        expect(result).toEqual({
          segmentA: 0,
          segmentB: 1000,
          segmentC: 3000,
          segmentD: 6000,
        })
      })
    })

    describe('when rundown is active', () => {
      describe('when next segment is after on air segment', () => {
        it('only returns entries for segments after next segment', () => {
          const segments: Segment[] = [
            testEntityFactory.createSegment({ id: 'segmentA', isOnAir: true }),
            testEntityFactory.createSegment({ id: 'segmentB', isNext: true }),
            testEntityFactory.createSegment({ id: 'segmentC' }),
            testEntityFactory.createSegment({ id: 'segmentD' }),
          ]

          const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments })
          const testee: RundownTimingService = createTestee()

          const result: Record<string, number> = testee.getStartOffsetsInMsFromNextCursorForSegments(rundown, expectedDurationsInMsForSegments)

          expect(result).toEqual({
            segmentB: 0,
            segmentC: 2000,
            segmentD: 5000,
          })
        })
      })

      describe('when next segment is before on air segment', () => {
        it('only returns entries for off air segments after next segment', () => {
          const segments: Segment[] = [
            testEntityFactory.createSegment({ id: 'segmentA', isNext: true }),
            testEntityFactory.createSegment({ id: 'segmentB', isOnAir: true }),
            testEntityFactory.createSegment({ id: 'segmentC' }),
            testEntityFactory.createSegment({ id: 'segmentD' }),
          ]

          const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments })
          const testee: RundownTimingService = createTestee()

          const result: Record<string, number> = testee.getStartOffsetsInMsFromNextCursorForSegments(rundown, expectedDurationsInMsForSegments)

          expect(result).toEqual({
            segmentA: 0,
            segmentC: 1000,
            segmentD: 4000,
          })
        })
      })
    })
  })
})

function createTestee(params: { partEntityService?: PartEntityService } = {}): RundownTimingService {
  const partEntityService: PartEntityService = params.partEntityService ?? instance(mock<PartEntityService>())
  return new RundownTimingService(partEntityService)
}
