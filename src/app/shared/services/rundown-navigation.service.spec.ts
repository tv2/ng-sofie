import { RundownNavigationService } from './rundown-navigation.service'
import { TestEntityFactory } from '../../test/factories/test-entity.factory'
import { Segment } from '../../core/models/segment'
import { Rundown } from '../../core/models/rundown'
import { RundownCursor } from '../../core/models/rundown-cursor'
import { Part } from '../../core/models/part'

describe(RundownNavigationService.name, () => {
  describe(RundownNavigationService.prototype.getRundownCursorForNearestValidSegmentBeforeSegmentMarkedAsNext.name, () => {
    describe('when the next cursor is on the first element', () => {
      it('throws an error', () => {
        const segments: Segment[] = [TestEntityFactory.createSegment({ id: 'first-segment-id' }), TestEntityFactory.createSegment({ id: 'next-segment-id', isNext: true })]
        const rundown: Rundown = TestEntityFactory.createRundown({ segments })
        const testee: RundownNavigationService = createTestee()

        const result: () => RundownCursor = () => testee.getRundownCursorForNearestValidSegmentBeforeSegmentMarkedAsNext(rundown)

        expect(result).toThrow()
      })
    })

    describe('when the above segment is valid', () => {
      it('returns a rundown cursor for the above segment', () => {
        const validPart: Part = TestEntityFactory.createPart({
          id: 'first-part-in-valid-segment-id',
          segmentId: 'valid-segment-above-id',
          pieces: [TestEntityFactory.createPiece()],
        })
        const validSegment: Segment = TestEntityFactory.createSegment({
          id: 'valid-segment-above-id',
          parts: [validPart],
        })
        const segments: Segment[] = [validSegment, TestEntityFactory.createSegment({ id: 'first-segment-id' }), TestEntityFactory.createSegment({ id: 'next-segment-id', isNext: true })]
        const rundown: Rundown = TestEntityFactory.createRundown({ segments })
        const expectedRundownCursor: RundownCursor = {
          segmentId: validPart.segmentId,
          partId: validPart.id,
        }
        const testee: RundownNavigationService = createTestee()

        const result: RundownCursor = testee.getRundownCursorForNearestValidSegmentBeforeSegmentMarkedAsNext(rundown)

        expect(result).toEqual(expectedRundownCursor)
      })
    })

    describe('when the above segment is invalid, but the segment above that is valid', () => {
      it('returns a rundown cursor for the valid segment above the invalid segment', () => {
        const validPart: Part = TestEntityFactory.createPart({
          id: 'first-part-in-valid-segment-id',
          segmentId: 'valid-segment-above-id',
          pieces: [TestEntityFactory.createPiece()],
        })
        const validSegment: Segment = TestEntityFactory.createSegment({
          id: 'valid-segment-above-id',
          parts: [validPart],
        })
        const invalidSegment: Segment = TestEntityFactory.createSegment()
        const segments: Segment[] = [
          validSegment,
          invalidSegment,
          TestEntityFactory.createSegment({ id: 'first-segment-id' }),
          TestEntityFactory.createSegment({ id: 'next-segment-id', isNext: true }),
        ]
        const rundown: Rundown = TestEntityFactory.createRundown({ segments })
        const expectedRundownCursor: RundownCursor = {
          segmentId: validPart.segmentId,
          partId: validPart.id,
        }
        const testee: RundownNavigationService = createTestee()

        const result: RundownCursor = testee.getRundownCursorForNearestValidSegmentBeforeSegmentMarkedAsNext(rundown)

        expect(result).toEqual(expectedRundownCursor)
      })
    })

    describe('when the above segment is on-air', () => {
      describe('when the on-air segment has an off-air part', () => {
        it('returns a rundown cursor for the off-air part in the on-air segment', () => {
          const validOnAirPart: Part = TestEntityFactory.createPart({
            id: 'on-air-part-in-valid-segment-id',
            isOnAir: true,
            segmentId: 'valid-on-air-segment-above-id',
            pieces: [TestEntityFactory.createPiece()],
          })
          const validOffAirPart: Part = TestEntityFactory.createPart({
            id: 'off-air-part-in-valid-segment-id',
            isOnAir: false,
            segmentId: 'valid-on-air-segment-above-id',
            pieces: [TestEntityFactory.createPiece()],
          })
          const validOnAirSegment: Segment = TestEntityFactory.createSegment({
            id: 'valid-on-air-segment-above-id',
            isOnAir: true,
            parts: [validOnAirPart, validOffAirPart],
          })
          const segments: Segment[] = [validOnAirSegment, TestEntityFactory.createSegment({ id: 'first-segment-id' }), TestEntityFactory.createSegment({ id: 'next-segment-id', isNext: true })]
          const rundown: Rundown = TestEntityFactory.createRundown({ segments })
          const expectedRundownCursor: RundownCursor = {
            segmentId: validOffAirPart.segmentId,
            partId: validOffAirPart.id,
          }
          const testee: RundownNavigationService = createTestee()

          const result: RundownCursor = testee.getRundownCursorForNearestValidSegmentBeforeSegmentMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })

      describe('when the on-air segment has no off-air parts, but is preceded by a valid segment', () => {
        it('returns a rundown cursor for the valid segment above the invalid segment', () => {
          const validPart: Part = TestEntityFactory.createPart({
            id: 'first-part-in-valid-segment-id',
            segmentId: 'valid-segment-above-id',
            pieces: [TestEntityFactory.createPiece()],
          })
          const validSegment: Segment = TestEntityFactory.createSegment({
            id: 'valid-segment-above-id',
            parts: [validPart],
          })
          const onAirPart: Part = TestEntityFactory.createPart({
            id: 'on-air-part-in-valid-segment-id',
            isOnAir: true,
            segmentId: 'valid-on-air-segment-above-id',
            pieces: [TestEntityFactory.createPiece()],
          })
          const onAirSegment: Segment = TestEntityFactory.createSegment({
            id: 'valid-on-air-segment-above-id',
            isOnAir: true,
            parts: [onAirPart],
          })
          const segments: Segment[] = [
            validSegment,
            onAirSegment,
            TestEntityFactory.createSegment({ id: 'first-segment-id' }),
            TestEntityFactory.createSegment({ id: 'next-segment-id', isNext: true }),
          ]
          const rundown: Rundown = TestEntityFactory.createRundown({ segments })
          const expectedRundownCursor: RundownCursor = {
            segmentId: validPart.segmentId,
            partId: validPart.id,
          }
          const testee: RundownNavigationService = createTestee()

          const result: RundownCursor = testee.getRundownCursorForNearestValidSegmentBeforeSegmentMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })
    })
  })

  describe(RundownNavigationService.prototype.getRundownCursorForNearestValidSegmentAfterSegmentMarkedAsNext.name, () => {
    describe('when the next cursor is on the last element', () => {
      it('throws an error', () => {
        const segments: Segment[] = [TestEntityFactory.createSegment({ id: 'first-segment-id' }), TestEntityFactory.createSegment({ id: 'next-segment-id', isNext: true })]
        const rundown: Rundown = TestEntityFactory.createRundown({ segments })
        const testee: RundownNavigationService = createTestee()

        const result: () => RundownCursor = () => testee.getRundownCursorForNearestValidSegmentAfterSegmentMarkedAsNext(rundown)

        expect(result).toThrow()
      })
    })

    describe('when the below segment is valid', () => {
      it('returns a rundown cursor for the above segment', () => {
        const validPart: Part = TestEntityFactory.createPart({
          id: 'first-part-in-valid-segment-id',
          segmentId: 'valid-segment-above-id',
          pieces: [TestEntityFactory.createPiece()],
        })
        const validSegment: Segment = TestEntityFactory.createSegment({
          id: 'valid-segment-above-id',
          parts: [validPart],
        })
        const segments: Segment[] = [TestEntityFactory.createSegment({ id: 'first-segment-id' }), TestEntityFactory.createSegment({ id: 'next-segment-id', isNext: true }), validSegment]
        const rundown: Rundown = TestEntityFactory.createRundown({ segments })
        const expectedRundownCursor: RundownCursor = {
          segmentId: validPart.segmentId,
          partId: validPart.id,
        }
        const testee: RundownNavigationService = createTestee()

        const result: RundownCursor = testee.getRundownCursorForNearestValidSegmentAfterSegmentMarkedAsNext(rundown)

        expect(result).toEqual(expectedRundownCursor)
      })
    })

    describe('when the below segment is invalid, but the segment below that is valid', () => {
      it('returns a rundown cursor for the valid segment below the invalid segment', () => {
        const validPart: Part = TestEntityFactory.createPart({
          id: 'first-part-in-valid-segment-id',
          segmentId: 'valid-segment-above-id',
          pieces: [TestEntityFactory.createPiece()],
        })
        const validSegment: Segment = TestEntityFactory.createSegment({
          id: 'valid-segment-above-id',
          parts: [validPart],
        })
        const invalidSegment: Segment = TestEntityFactory.createSegment()
        const segments: Segment[] = [
          TestEntityFactory.createSegment({ id: 'first-segment-id' }),
          TestEntityFactory.createSegment({ id: 'next-segment-id', isNext: true }),
          invalidSegment,
          validSegment,
        ]
        const rundown: Rundown = TestEntityFactory.createRundown({ segments })
        const expectedRundownCursor: RundownCursor = {
          segmentId: validPart.segmentId,
          partId: validPart.id,
        }
        const testee: RundownNavigationService = createTestee()

        const result: RundownCursor = testee.getRundownCursorForNearestValidSegmentAfterSegmentMarkedAsNext(rundown)

        expect(result).toEqual(expectedRundownCursor)
      })
    })

    describe('when the below segment is on-air', () => {
      describe('when the on-air segment has an off-air part', () => {
        it('returns a rundown cursor for the off-air part in the on-air segment', () => {
          const validOnAirPart: Part = TestEntityFactory.createPart({
            id: 'on-air-part-in-valid-segment-id',
            isOnAir: true,
            segmentId: 'valid-on-air-segment-above-id',
            pieces: [TestEntityFactory.createPiece()],
          })
          const validOffAirPart: Part = TestEntityFactory.createPart({
            id: 'off-air-part-in-valid-segment-id',
            isOnAir: false,
            segmentId: 'valid-on-air-segment-above-id',
            pieces: [TestEntityFactory.createPiece()],
          })
          const validOnAirSegment: Segment = TestEntityFactory.createSegment({
            id: 'valid-on-air-segment-above-id',
            isOnAir: true,
            parts: [validOnAirPart, validOffAirPart],
          })
          const segments: Segment[] = [TestEntityFactory.createSegment({ id: 'first-segment-id' }), TestEntityFactory.createSegment({ id: 'next-segment-id', isNext: true }), validOnAirSegment]
          const rundown: Rundown = TestEntityFactory.createRundown({ segments })
          const expectedRundownCursor: RundownCursor = {
            segmentId: validOffAirPart.segmentId,
            partId: validOffAirPart.id,
          }
          const testee: RundownNavigationService = createTestee()

          const result: RundownCursor = testee.getRundownCursorForNearestValidSegmentAfterSegmentMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })

      describe('when the on-air segment has no off-air parts, but is succeeded by a valid segment', () => {
        it('returns a rundown cursor for the valid segment above the invalid segment', () => {
          const validPart: Part = TestEntityFactory.createPart({
            id: 'first-part-in-valid-segment-id',
            segmentId: 'valid-segment-above-id',
            pieces: [TestEntityFactory.createPiece()],
          })
          const validSegment: Segment = TestEntityFactory.createSegment({
            id: 'valid-segment-above-id',
            parts: [validPart],
          })
          const onAirPart: Part = TestEntityFactory.createPart({
            id: 'on-air-part-in-valid-segment-id',
            isOnAir: true,
            segmentId: 'valid-on-air-segment-above-id',
            pieces: [TestEntityFactory.createPiece()],
          })
          const onAirSegment: Segment = TestEntityFactory.createSegment({
            id: 'valid-on-air-segment-above-id',
            isOnAir: true,
            parts: [onAirPart],
          })
          const segments: Segment[] = [
            TestEntityFactory.createSegment({ id: 'first-segment-id' }),
            TestEntityFactory.createSegment({ id: 'next-segment-id', isNext: true }),
            onAirSegment,
            validSegment,
          ]
          const rundown: Rundown = TestEntityFactory.createRundown({ segments })
          const expectedRundownCursor: RundownCursor = {
            segmentId: validPart.segmentId,
            partId: validPart.id,
          }
          const testee: RundownNavigationService = createTestee()

          const result: RundownCursor = testee.getRundownCursorForNearestValidSegmentAfterSegmentMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })
    })
  })

  describe(RundownNavigationService.prototype.getRundownCursorForNearestValidPartBeforePartMarkedAsNext.name, () => {
    describe('when there are no prior valid parts', () => {
      it('throws an error', () => {
        const segmentId: string = 'next-segment-id'
        const part: Part = TestEntityFactory.createPart({ id: 'next-part-id', segmentId, isNext: true })
        const segment: Segment = TestEntityFactory.createSegment({ id: segmentId, isNext: true, parts: [part] })
        const rundown: Rundown = TestEntityFactory.createRundown({ segments: [segment] })
        const testee: RundownNavigationService = createTestee()

        const result: () => RundownCursor = () => testee.getRundownCursorForNearestValidPartBeforePartMarkedAsNext(rundown)

        expect(result).toThrow()
      })
    })

    describe('when nearest valid part is in same segment', () => {
      describe('when nearest valid part is adjacent', () => {
        it('returns a rundown cursor for the adjacent part', () => {
          const validPartId: string = 'valid-part-id'
          const segmentId: string = 'next-segment-id'
          const validPart: Part = TestEntityFactory.createPart({ id: validPartId, segmentId, pieces: [TestEntityFactory.createPiece()] })
          const nextPart: Part = TestEntityFactory.createPart({ id: 'next-part-id', segmentId, isNext: true })
          const segment: Segment = TestEntityFactory.createSegment({ id: segmentId, isNext: true, parts: [validPart, nextPart] })
          const rundown: Rundown = TestEntityFactory.createRundown({ segments: [segment] })
          const testee: RundownNavigationService = createTestee()

          const expectedRundownCursor: RundownCursor = {
            segmentId,
            partId: validPartId,
          }

          const result: RundownCursor = testee.getRundownCursorForNearestValidPartBeforePartMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })

      describe('when nearest valid part is succeeded by an invalid part', () => {
        it('returns a rundown cursor for the valid part', () => {
          const validPartId: string = 'valid-part-id'
          const segmentId: string = 'next-segment-id'
          const validPart: Part = TestEntityFactory.createPart({ id: validPartId, segmentId, pieces: [TestEntityFactory.createPiece()] })
          const invalidPart: Part = TestEntityFactory.createPart({ invalidity: { reason: 'some reason' } })
          const nextPart: Part = TestEntityFactory.createPart({ id: 'next-part-id', segmentId, isNext: true })
          const segment: Segment = TestEntityFactory.createSegment({ id: segmentId, isNext: true, parts: [validPart, invalidPart, nextPart] })
          const rundown: Rundown = TestEntityFactory.createRundown({ segments: [segment] })
          const testee: RundownNavigationService = createTestee()

          const expectedRundownCursor: RundownCursor = {
            segmentId,
            partId: validPartId,
          }

          const result: RundownCursor = testee.getRundownCursorForNearestValidPartBeforePartMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })

      describe('when nearest part is succeeded by an on-air part', () => {
        it('returns a rundown cursor for the valid part', () => {
          const validPartId: string = 'valid-part-id'
          const segmentId: string = 'next-segment-id'
          const validPart: Part = TestEntityFactory.createPart({ id: validPartId, segmentId, pieces: [TestEntityFactory.createPiece()] })
          const onAirPart: Part = TestEntityFactory.createPart({ isOnAir: true })
          const nextPart: Part = TestEntityFactory.createPart({ id: 'next-part-id', segmentId, isNext: true })
          const segment: Segment = TestEntityFactory.createSegment({ id: segmentId, isNext: true, parts: [validPart, onAirPart, nextPart] })
          const rundown: Rundown = TestEntityFactory.createRundown({ segments: [segment] })
          const testee: RundownNavigationService = createTestee()

          const expectedRundownCursor: RundownCursor = {
            segmentId,
            partId: validPartId,
          }

          const result: RundownCursor = testee.getRundownCursorForNearestValidPartBeforePartMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })
    })

    describe('when nearest valid part is in the adjacent segment', () => {
      describe('when last part is valid', () => {
        it('returns a rundown cursor for the last part in the adjacent segment', () => {
          const validSegmentId: string = 'valid-segment-id'
          const validPartId: string = 'valid-part-id'
          const validPart: Part = TestEntityFactory.createPart({ id: validPartId, segmentId: validSegmentId, pieces: [TestEntityFactory.createPiece()] })
          const validSegment: Segment = TestEntityFactory.createSegment({ id: validSegmentId, parts: [validPart] })

          const segmentId: string = 'next-segment-id'
          const nextPart: Part = TestEntityFactory.createPart({ id: 'next-part-id', segmentId, isNext: true })
          const nextSegment: Segment = TestEntityFactory.createSegment({ id: segmentId, isNext: true, parts: [nextPart] })

          const rundown: Rundown = TestEntityFactory.createRundown({ segments: [validSegment, nextSegment] })
          const testee: RundownNavigationService = createTestee()

          const expectedRundownCursor: RundownCursor = {
            segmentId: validPart.segmentId,
            partId: validPart.id,
          }

          const result: RundownCursor = testee.getRundownCursorForNearestValidPartBeforePartMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })

      describe('when nearest part succeeded by an invalid part', () => {
        it('returns a rundown cursor for the valid part', () => {
          const validSegmentId: string = 'valid-segment-id'
          const validPartId: string = 'valid-part-id'
          const validPart: Part = TestEntityFactory.createPart({ id: validPartId, segmentId: validSegmentId, pieces: [TestEntityFactory.createPiece()] })
          const invalidPart: Part = TestEntityFactory.createPart({ invalidity: { reason: 'some reason' } })
          const validSegment: Segment = TestEntityFactory.createSegment({ id: validSegmentId, parts: [validPart, invalidPart] })

          const segmentId: string = 'next-segment-id'
          const nextPart: Part = TestEntityFactory.createPart({ id: 'next-part-id', segmentId, isNext: true })
          const nextSegment: Segment = TestEntityFactory.createSegment({ id: segmentId, isNext: true, parts: [nextPart] })

          const rundown: Rundown = TestEntityFactory.createRundown({ segments: [validSegment, nextSegment] })
          const testee: RundownNavigationService = createTestee()

          const expectedRundownCursor: RundownCursor = {
            segmentId: validPart.segmentId,
            partId: validPart.id,
          }

          const result: RundownCursor = testee.getRundownCursorForNearestValidPartBeforePartMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })

      describe('when nearest part succeeded by an on-air part', () => {
        it('returns a rundown cursor for the valid part', () => {
          const validSegmentId: string = 'valid-segment-id'
          const validPartId: string = 'valid-part-id'
          const validPart: Part = TestEntityFactory.createPart({
            id: validPartId,
            segmentId: validSegmentId,
            pieces: [TestEntityFactory.createPiece()],
          })
          const onAirPart: Part = TestEntityFactory.createPart({
            isOnAir: true,
            pieces: [TestEntityFactory.createPiece()],
          })
          const validSegment: Segment = TestEntityFactory.createSegment({
            id: validSegmentId,
            parts: [validPart, onAirPart],
          })

          const segmentId: string = 'next-segment-id'
          const nextPart: Part = TestEntityFactory.createPart({ id: 'next-part-id', segmentId, isNext: true })
          const nextSegment: Segment = TestEntityFactory.createSegment({ id: segmentId, isNext: true, parts: [nextPart] })

          const rundown: Rundown = TestEntityFactory.createRundown({ segments: [validSegment, nextSegment] })
          const testee: RundownNavigationService = createTestee()

          const expectedRundownCursor: RundownCursor = {
            segmentId: validPart.segmentId,
            partId: validPart.id,
          }

          const result: RundownCursor = testee.getRundownCursorForNearestValidPartBeforePartMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })
    })

    describe('when nearest valid part is in a segment succeeded by an invalid segment', () => {
      describe('when last part is valid', () => {
        it('returns a rundown cursor for the last part in the adjacent segment', () => {
          const validSegmentId: string = 'valid-segment-id'
          const validPartId: string = 'valid-part-id'
          const validPart: Part = TestEntityFactory.createPart({ id: validPartId, segmentId: validSegmentId, pieces: [TestEntityFactory.createPiece()] })
          const validSegment: Segment = TestEntityFactory.createSegment({ id: validSegmentId, parts: [validPart] })

          const invalidSegment: Segment = TestEntityFactory.createSegment()

          const segmentId: string = 'next-segment-id'
          const nextPart: Part = TestEntityFactory.createPart({ id: 'next-part-id', segmentId, isNext: true })
          const nextSegment: Segment = TestEntityFactory.createSegment({ id: segmentId, isNext: true, parts: [nextPart] })

          const rundown: Rundown = TestEntityFactory.createRundown({ segments: [validSegment, invalidSegment, nextSegment] })
          const testee: RundownNavigationService = createTestee()

          const expectedRundownCursor: RundownCursor = {
            segmentId: validPart.segmentId,
            partId: validPart.id,
          }

          const result: RundownCursor = testee.getRundownCursorForNearestValidPartBeforePartMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })

      describe('when nearest part succeeded by an invalid part', () => {
        it('returns a rundown cursor for the valid part', () => {
          const validSegmentId: string = 'valid-segment-id'
          const validPartId: string = 'valid-part-id'
          const validPart: Part = TestEntityFactory.createPart({ id: validPartId, segmentId: validSegmentId, pieces: [TestEntityFactory.createPiece()] })
          const invalidPart: Part = TestEntityFactory.createPart({ invalidity: { reason: 'some reason' } })
          const validSegment: Segment = TestEntityFactory.createSegment({ id: validSegmentId, parts: [validPart, invalidPart] })

          const invalidSegment: Segment = TestEntityFactory.createSegment()

          const segmentId: string = 'next-segment-id'
          const nextPart: Part = TestEntityFactory.createPart({ id: 'next-part-id', segmentId, isNext: true })
          const nextSegment: Segment = TestEntityFactory.createSegment({ id: segmentId, isNext: true, parts: [nextPart] })

          const rundown: Rundown = TestEntityFactory.createRundown({ segments: [validSegment, invalidSegment, nextSegment] })
          const testee: RundownNavigationService = createTestee()

          const expectedRundownCursor: RundownCursor = {
            segmentId: validPart.segmentId,
            partId: validPart.id,
          }

          const result: RundownCursor = testee.getRundownCursorForNearestValidPartBeforePartMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })

      describe('when nearest part succeeded by an on-air part', () => {
        it('returns a rundown cursor for the valid part', () => {
          const validSegmentId: string = 'valid-segment-id'
          const validPartId: string = 'valid-part-id'
          const validPart: Part = TestEntityFactory.createPart({
            id: validPartId,
            segmentId: validSegmentId,
            pieces: [TestEntityFactory.createPiece()],
          })
          const onAirPart: Part = TestEntityFactory.createPart({
            isOnAir: true,
            pieces: [TestEntityFactory.createPiece()],
          })
          const validSegment: Segment = TestEntityFactory.createSegment({
            id: validSegmentId,
            parts: [validPart, onAirPart],
          })

          const invalidSegment: Segment = TestEntityFactory.createSegment()

          const segmentId: string = 'next-segment-id'
          const nextPart: Part = TestEntityFactory.createPart({ id: 'next-part-id', segmentId, isNext: true })
          const nextSegment: Segment = TestEntityFactory.createSegment({ id: segmentId, isNext: true, parts: [nextPart] })

          const rundown: Rundown = TestEntityFactory.createRundown({ segments: [validSegment, invalidSegment, nextSegment] })
          const testee: RundownNavigationService = createTestee()

          const expectedRundownCursor: RundownCursor = {
            segmentId: validPart.segmentId,
            partId: validPart.id,
          }

          const result: RundownCursor = testee.getRundownCursorForNearestValidPartBeforePartMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })
    })
  })

  describe(RundownNavigationService.prototype.getRundownCursorForNearestValidPartAfterPartMarkedAsNext.name, () => {
    describe('when there are no subsequent valid parts', () => {
      it('throws an error', () => {
        const segmentId: string = 'next-segment-id'
        const part: Part = TestEntityFactory.createPart({ id: 'next-part-id', segmentId, isNext: true })
        const segment: Segment = TestEntityFactory.createSegment({ id: segmentId, isNext: true, parts: [part] })
        const rundown: Rundown = TestEntityFactory.createRundown({ segments: [segment] })
        const testee: RundownNavigationService = createTestee()

        const result: () => RundownCursor = () => testee.getRundownCursorForNearestValidPartAfterPartMarkedAsNext(rundown)

        expect(result).toThrow()
      })
    })

    describe('when nearest valid part is in same segment', () => {
      describe('when nearest valid part is adjacent', () => {
        it('returns a rundown cursor for the adjacent part', () => {
          const validPartId: string = 'valid-part-id'
          const segmentId: string = 'next-segment-id'
          const validPart: Part = TestEntityFactory.createPart({ id: validPartId, segmentId, pieces: [TestEntityFactory.createPiece()] })
          const nextPart: Part = TestEntityFactory.createPart({ id: 'next-part-id', segmentId, isNext: true })
          const segment: Segment = TestEntityFactory.createSegment({ id: segmentId, isNext: true, parts: [nextPart, validPart] })
          const rundown: Rundown = TestEntityFactory.createRundown({ segments: [segment] })
          const testee: RundownNavigationService = createTestee()

          const expectedRundownCursor: RundownCursor = {
            segmentId,
            partId: validPartId,
          }

          const result: RundownCursor = testee.getRundownCursorForNearestValidPartAfterPartMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })

      describe('when nearest valid part is preceded by an invalid part', () => {
        it('returns a rundown cursor for the valid part', () => {
          const validPartId: string = 'valid-part-id'
          const segmentId: string = 'next-segment-id'
          const validPart: Part = TestEntityFactory.createPart({ id: validPartId, segmentId, pieces: [TestEntityFactory.createPiece()] })
          const invalidPart: Part = TestEntityFactory.createPart({ invalidity: { reason: 'some reason' } })
          const nextPart: Part = TestEntityFactory.createPart({ id: 'next-part-id', segmentId, isNext: true })
          const segment: Segment = TestEntityFactory.createSegment({ id: segmentId, isNext: true, parts: [nextPart, invalidPart, validPart] })
          const rundown: Rundown = TestEntityFactory.createRundown({ segments: [segment] })
          const testee: RundownNavigationService = createTestee()

          const expectedRundownCursor: RundownCursor = {
            segmentId,
            partId: validPartId,
          }

          const result: RundownCursor = testee.getRundownCursorForNearestValidPartAfterPartMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })

      describe('when nearest part is preceded by an on-air part', () => {
        it('returns a rundown cursor for the valid part', () => {
          const validPartId: string = 'valid-part-id'
          const segmentId: string = 'next-segment-id'
          const validPart: Part = TestEntityFactory.createPart({ id: validPartId, segmentId, pieces: [TestEntityFactory.createPiece()] })
          const onAirPart: Part = TestEntityFactory.createPart({ isOnAir: true })
          const nextPart: Part = TestEntityFactory.createPart({ id: 'next-part-id', segmentId, isNext: true })
          const segment: Segment = TestEntityFactory.createSegment({ id: segmentId, isNext: true, parts: [nextPart, onAirPart, validPart] })
          const rundown: Rundown = TestEntityFactory.createRundown({ segments: [segment] })
          const testee: RundownNavigationService = createTestee()

          const expectedRundownCursor: RundownCursor = {
            segmentId,
            partId: validPartId,
          }

          const result: RundownCursor = testee.getRundownCursorForNearestValidPartAfterPartMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })
    })

    describe('when nearest valid part is in the adjacent segment', () => {
      describe('when last part is valid', () => {
        it('returns a rundown cursor for the last part in the adjacent segment', () => {
          const validSegmentId: string = 'valid-segment-id'
          const validPartId: string = 'valid-part-id'
          const validPart: Part = TestEntityFactory.createPart({ id: validPartId, segmentId: validSegmentId, pieces: [TestEntityFactory.createPiece()] })
          const validSegment: Segment = TestEntityFactory.createSegment({ id: validSegmentId, parts: [validPart] })

          const segmentId: string = 'next-segment-id'
          const nextPart: Part = TestEntityFactory.createPart({ id: 'next-part-id', segmentId, isNext: true })
          const nextSegment: Segment = TestEntityFactory.createSegment({ id: segmentId, isNext: true, parts: [nextPart] })

          const rundown: Rundown = TestEntityFactory.createRundown({ segments: [nextSegment, validSegment] })
          const testee: RundownNavigationService = createTestee()

          const expectedRundownCursor: RundownCursor = {
            segmentId: validPart.segmentId,
            partId: validPart.id,
          }

          const result: RundownCursor = testee.getRundownCursorForNearestValidPartAfterPartMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })

      describe('when nearest part preceded by an invalid part', () => {
        it('returns a rundown cursor for the valid part', () => {
          const validSegmentId: string = 'valid-segment-id'
          const validPartId: string = 'valid-part-id'
          const validPart: Part = TestEntityFactory.createPart({ id: validPartId, segmentId: validSegmentId, pieces: [TestEntityFactory.createPiece()] })
          const invalidPart: Part = TestEntityFactory.createPart({ invalidity: { reason: 'some reason' } })
          const validSegment: Segment = TestEntityFactory.createSegment({ id: validSegmentId, parts: [invalidPart, validPart] })

          const segmentId: string = 'next-segment-id'
          const nextPart: Part = TestEntityFactory.createPart({ id: 'next-part-id', segmentId, isNext: true })
          const nextSegment: Segment = TestEntityFactory.createSegment({ id: segmentId, isNext: true, parts: [nextPart] })

          const rundown: Rundown = TestEntityFactory.createRundown({ segments: [nextSegment, validSegment] })
          const testee: RundownNavigationService = createTestee()

          const expectedRundownCursor: RundownCursor = {
            segmentId: validPart.segmentId,
            partId: validPart.id,
          }

          const result: RundownCursor = testee.getRundownCursorForNearestValidPartAfterPartMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })

      describe('when nearest part preceded by an on-air part', () => {
        it('returns a rundown cursor for the valid part', () => {
          const validSegmentId: string = 'valid-segment-id'
          const validPartId: string = 'valid-part-id'
          const validPart: Part = TestEntityFactory.createPart({
            id: validPartId,
            segmentId: validSegmentId,
            pieces: [TestEntityFactory.createPiece()],
          })
          const onAirPart: Part = TestEntityFactory.createPart({
            isOnAir: true,
            pieces: [TestEntityFactory.createPiece()],
          })
          const validSegment: Segment = TestEntityFactory.createSegment({
            id: validSegmentId,
            parts: [onAirPart, validPart],
          })

          const segmentId: string = 'next-segment-id'
          const nextPart: Part = TestEntityFactory.createPart({ id: 'next-part-id', segmentId, isNext: true })
          const nextSegment: Segment = TestEntityFactory.createSegment({ id: segmentId, isNext: true, parts: [nextPart] })

          const rundown: Rundown = TestEntityFactory.createRundown({ segments: [nextSegment, validSegment] })
          const testee: RundownNavigationService = createTestee()

          const expectedRundownCursor: RundownCursor = {
            segmentId: validPart.segmentId,
            partId: validPart.id,
          }

          const result: RundownCursor = testee.getRundownCursorForNearestValidPartAfterPartMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })
    })

    describe('when nearest valid part is in a segment preceded by an invalid segment', () => {
      describe('when last part is valid', () => {
        it('returns a rundown cursor for the last part in the adjacent segment', () => {
          const validSegmentId: string = 'valid-segment-id'
          const validPartId: string = 'valid-part-id'
          const validPart: Part = TestEntityFactory.createPart({ id: validPartId, segmentId: validSegmentId, pieces: [TestEntityFactory.createPiece()] })
          const validSegment: Segment = TestEntityFactory.createSegment({ id: validSegmentId, parts: [validPart] })

          const invalidSegment: Segment = TestEntityFactory.createSegment()

          const segmentId: string = 'next-segment-id'
          const nextPart: Part = TestEntityFactory.createPart({ id: 'next-part-id', segmentId, isNext: true })
          const nextSegment: Segment = TestEntityFactory.createSegment({ id: segmentId, isNext: true, parts: [nextPart] })

          const rundown: Rundown = TestEntityFactory.createRundown({ segments: [nextSegment, invalidSegment, validSegment] })
          const testee: RundownNavigationService = createTestee()

          const expectedRundownCursor: RundownCursor = {
            segmentId: validPart.segmentId,
            partId: validPart.id,
          }

          const result: RundownCursor = testee.getRundownCursorForNearestValidPartAfterPartMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })

      describe('when nearest part preceded by an invalid part', () => {
        it('returns a rundown cursor for the valid part', () => {
          const validSegmentId: string = 'valid-segment-id'
          const validPartId: string = 'valid-part-id'
          const validPart: Part = TestEntityFactory.createPart({ id: validPartId, segmentId: validSegmentId, pieces: [TestEntityFactory.createPiece()] })
          const invalidPart: Part = TestEntityFactory.createPart({ invalidity: { reason: 'some reason' } })
          const validSegment: Segment = TestEntityFactory.createSegment({ id: validSegmentId, parts: [invalidPart, validPart] })

          const invalidSegment: Segment = TestEntityFactory.createSegment()

          const segmentId: string = 'next-segment-id'
          const nextPart: Part = TestEntityFactory.createPart({ id: 'next-part-id', segmentId, isNext: true })
          const nextSegment: Segment = TestEntityFactory.createSegment({ id: segmentId, isNext: true, parts: [nextPart] })

          const rundown: Rundown = TestEntityFactory.createRundown({ segments: [nextSegment, invalidSegment, validSegment] })
          const testee: RundownNavigationService = createTestee()

          const expectedRundownCursor: RundownCursor = {
            segmentId: validPart.segmentId,
            partId: validPart.id,
          }

          const result: RundownCursor = testee.getRundownCursorForNearestValidPartAfterPartMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })

      describe('when nearest part preceded by an on-air part', () => {
        it('returns a rundown cursor for the valid part', () => {
          const validSegmentId: string = 'valid-segment-id'
          const validPartId: string = 'valid-part-id'
          const validPart: Part = TestEntityFactory.createPart({
            id: validPartId,
            segmentId: validSegmentId,
            pieces: [TestEntityFactory.createPiece()],
          })
          const onAirPart: Part = TestEntityFactory.createPart({
            isOnAir: true,
            pieces: [TestEntityFactory.createPiece()],
          })
          const validSegment: Segment = TestEntityFactory.createSegment({
            id: validSegmentId,
            parts: [onAirPart, validPart],
          })

          const invalidSegment: Segment = TestEntityFactory.createSegment()

          const segmentId: string = 'next-segment-id'
          const nextPart: Part = TestEntityFactory.createPart({ id: 'next-part-id', segmentId, isNext: true })
          const nextSegment: Segment = TestEntityFactory.createSegment({ id: segmentId, isNext: true, parts: [nextPart] })

          const rundown: Rundown = TestEntityFactory.createRundown({ segments: [nextSegment, invalidSegment, validSegment] })
          const testee: RundownNavigationService = createTestee()

          const expectedRundownCursor: RundownCursor = {
            segmentId: validPart.segmentId,
            partId: validPart.id,
          }

          const result: RundownCursor = testee.getRundownCursorForNearestValidPartAfterPartMarkedAsNext(rundown)

          expect(result).toEqual(expectedRundownCursor)
        })
      })
    })
  })
})

function createTestee(): RundownNavigationService {
  return new RundownNavigationService()
}
