import { RundownEntityService } from './rundown-entity.service'
import { SegmentEntityService } from './segment-entity.service'
import { anyNumber, anyString, anything, instance, mock, verify, when } from '@typestrong/ts-mockito'
import { Rundown } from '../../models/rundown'
import { TestEntityFactory } from '../../../test/factories/test-entity.factory'
import { Segment } from '../../models/segment'
import { Piece } from '../../models/piece'
import { RundownCursor } from '../../models/rundown-cursor'
import { Part } from '../../models/part'
import { RundownMode } from '../../enums/rundown-mode'

describe(RundownEntityService.name, () => {
  describe(RundownEntityService.prototype.activate.name, () => {
    it('resets all segments', () => {
      const segments: Segment[] = [TestEntityFactory.createSegment(), TestEntityFactory.createSegment(), TestEntityFactory.createSegment()]
      const rundown: Rundown = TestEntityFactory.createRundown({ segments })
      const mockedSegmentEntityService = mock<SegmentEntityService>()
      when(mockedSegmentEntityService.reset(anything())).thenCall(segment => segment)
      const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))

      testee.activate(rundown)

      segments.forEach(segment => verify(mockedSegmentEntityService.reset(segment)).once())
    })

    it('marks rundown as active', () => {
      const rundown: Rundown = TestEntityFactory.createRundown()
      const testee: RundownEntityService = createTestee()

      const result: Rundown = testee.activate(rundown)

      expect(rundown.mode).toBe(RundownMode.INACTIVE)
      expect(result.mode).toBe(RundownMode.ACTIVE)
    })

    it('does not put any segments on-air', () => {
      const segments: Segment[] = [TestEntityFactory.createSegment(), TestEntityFactory.createSegment(), TestEntityFactory.createSegment()]
      const rundown: Rundown = TestEntityFactory.createRundown({ segments })
      const mockedSegmentEntityService = mock<SegmentEntityService>()
      when(mockedSegmentEntityService.reset(anything())).thenCall(segment => segment)
      const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))

      testee.activate(rundown)

      verify(mockedSegmentEntityService.putOnAir(anything(), anyString(), anyNumber())).never()
    })
  })

  describe(RundownEntityService.prototype.deactivate.name, () => {
    it('marks rundown as inactive', () => {
      const rundown = TestEntityFactory.createRundown({ mode: RundownMode.ACTIVE })
      const testee: RundownEntityService = createTestee()

      const result: Rundown = testee.deactivate(rundown, Date.now())

      expect(rundown.mode).toBe(RundownMode.ACTIVE)
      expect(result.mode).toBe(RundownMode.INACTIVE)
    })

    it('takes all segments off-air', () => {
      const segments = [TestEntityFactory.createSegment(), TestEntityFactory.createSegment(), TestEntityFactory.createSegment()]
      const rundown = TestEntityFactory.createRundown({ mode: RundownMode.ACTIVE, segments })
      const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
      when(mockedSegmentEntityService.takeOffAir(anything(), anyNumber())).thenCall(segment => segment)
      const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))

      const deactivatedAt: number = Date.now()
      testee.deactivate(rundown, deactivatedAt)

      segments.forEach(segment => verify(mockedSegmentEntityService.takeOffAir(segment, deactivatedAt)))
    })

    it('unmarks segments set as next', () => {
      const segments: Segment[] = [TestEntityFactory.createSegment(), TestEntityFactory.createSegment({ isNext: true }), TestEntityFactory.createSegment()]
      const rundown: Rundown = TestEntityFactory.createRundown({ segments })
      const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
      when(mockedSegmentEntityService.takeOffAir(anything(), anyNumber())).thenCall(segment => segment)
      const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))

      testee.deactivate(rundown, Date.now())

      verify(mockedSegmentEntityService.unmarkSegmentAsNext(segments[1])).once()
    })

    it('clears infinite pieces', () => {
      const infinitePieces: Piece[] = [TestEntityFactory.createPiece(), TestEntityFactory.createPiece(), TestEntityFactory.createPiece()]
      const rundown: Rundown = TestEntityFactory.createRundown({ infinitePieces })
      const testee: RundownEntityService = createTestee()

      const result: Rundown = testee.deactivate(rundown, Date.now())

      expect(rundown.infinitePieces).toBe(infinitePieces)
      expect(result.infinitePieces).toEqual([])
    })
  })

  describe(RundownEntityService.prototype.takeNext.name, () => {
    describe('when given a rundown cursor that points to an already on-air segment', () => {
      it('does not mark the segment as off-air', () => {
        const rundownCursor: RundownCursor = {
          segmentId: 'segment-id',
          partId: 'part-id',
        }
        const segment: Segment = TestEntityFactory.createSegment({ id: rundownCursor.segmentId, isOnAir: true, isNext: true })
        const rundown: Rundown = TestEntityFactory.createRundown({ mode: RundownMode.ACTIVE, segments: [segment] })
        const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
        when(mockedSegmentEntityService.takeOffAir(anything(), anyNumber())).thenCall(segment => segment)
        const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))
        const takenAt: number = Date.now()

        testee.takeNext(rundown, rundownCursor, takenAt)

        verify(mockedSegmentEntityService.takeOffAir(segment, anyNumber())).never()
      })

      it('puts segment on-air', () => {
        const rundownCursor: RundownCursor = {
          segmentId: 'segment-id',
          partId: 'part-id',
        }
        const segment: Segment = TestEntityFactory.createSegment({ id: rundownCursor.segmentId, isOnAir: true, isNext: true })
        const rundown: Rundown = TestEntityFactory.createRundown({ mode: RundownMode.ACTIVE, segments: [segment] })
        const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
        when(mockedSegmentEntityService.takeOffAir(anything(), anyNumber())).thenCall(segment => segment)
        const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))
        const takenAt: number = Date.now()

        testee.takeNext(rundown, rundownCursor, takenAt)

        verify(mockedSegmentEntityService.putOnAir(segment, rundownCursor.partId, takenAt)).once()
      })
    })

    describe('when given a rundown cursor that points to an off-air segment', () => {
      it('unmarks the on-air segment as next', () => {
        const nextSegmentId: string = 'next-segment-id'
        const rundownCursor: RundownCursor = {
          segmentId: nextSegmentId,
          partId: 'next-part-id',
        }
        const segments: Segment[] = [TestEntityFactory.createSegment({ id: 'segment1', isOnAir: true }), TestEntityFactory.createSegment({ id: nextSegmentId, isNext: true })]
        const rundown: Rundown = TestEntityFactory.createRundown({ mode: RundownMode.ACTIVE, segments })
        const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
        when(mockedSegmentEntityService.takeOffAir(anything(), anyNumber())).thenCall(() => TestEntityFactory.createSegment())
        const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))

        const takenAt: number = Date.now()
        testee.takeNext(rundown, rundownCursor, takenAt)

        verify(mockedSegmentEntityService.takeOffAir(segments[0], takenAt)).once()
      })

      it('puts segment on-air', () => {
        const nextSegmentId: string = 'next-segment-id'
        const nextPartId: string = 'next-part-id'
        const segment: Segment = TestEntityFactory.createSegment({ id: nextSegmentId })
        const rundown: Rundown = TestEntityFactory.createRundown({ mode: RundownMode.ACTIVE, segments: [segment] })
        const rundownCursor: RundownCursor = { segmentId: nextSegmentId, partId: nextPartId }

        const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
        const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))
        const takenAt: number = Date.now()

        testee.takeNext(rundown, rundownCursor, takenAt)

        verify(mockedSegmentEntityService.putOnAir(segment, nextPartId, takenAt)).once()
      })
    })
  })

  describe(RundownEntityService.prototype.setNext.name, () => {
    describe('when given next cursor targeting on-air segment', () => {
      it('does not reset segment', () => {
        const rundownCursor: RundownCursor = { segmentId: 'next-segment-id', partId: 'part-id' }
        const segment: Segment = TestEntityFactory.createSegment({ id: rundownCursor.segmentId, isOnAir: true, isNext: true })
        const rundown: Rundown = TestEntityFactory.createRundown({ segments: [segment] })
        const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
        when(mockedSegmentEntityService.unmarkSegmentAsNext(anything())).thenCall(segment => segment)
        when(mockedSegmentEntityService.removeUnplannedUnplayedPartsAndPieces(anything())).thenCall(segment => segment)
        const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))

        testee.setNext(rundown, rundownCursor)

        verify(mockedSegmentEntityService.reset(segment)).never()
      })

      it('unmarks previous set-as-next part as next and then marks next part', () => {
        const rundownCursor: RundownCursor = { segmentId: 'next-segment-id', partId: 'part-id' }
        const segment: Segment = TestEntityFactory.createSegment({ id: rundownCursor.segmentId, isOnAir: true, isNext: true })
        const rundown: Rundown = TestEntityFactory.createRundown({ segments: [segment] })
        const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
        when(mockedSegmentEntityService.unmarkSegmentAsNext(anything())).thenCall(segment => segment)
        when(mockedSegmentEntityService.removeUnplannedUnplayedPartsAndPieces(anything())).thenCall(segment => segment)
        const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))

        testee.setNext(rundown, rundownCursor)

        verify(mockedSegmentEntityService.unmarkSegmentAsNext(segment)).once()
        verify(mockedSegmentEntityService.setAsNextSegment(segment, rundownCursor.partId)).once()
        verify(mockedSegmentEntityService.setAsNextSegment(segment, rundownCursor.partId)).calledAfter(mockedSegmentEntityService.unmarkSegmentAsNext(segment))
      })
    })

    describe('when given next cursor targeting off-air segment', () => {
      it('resets the segment', () => {
        const segmentId: string = 'segment-id'
        const segment: Segment = TestEntityFactory.createSegment()
        const rundown: Rundown = TestEntityFactory.createRundown({ segments: [segment] })
        const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
        when(mockedSegmentEntityService.reset(anything())).thenCall(segment => segment)
        const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))
        const rundownCursor: RundownCursor = { segmentId, partId: 'part-id' }

        testee.setNext(rundown, rundownCursor)

        verify(mockedSegmentEntityService.reset(segment)).once()
      })

      it('unmarks the previous set-as-next segment as next', () => {
        const nextSegmentId: string = 'next-segment-id'
        const rundownCursor: RundownCursor = { segmentId: nextSegmentId, partId: 'part-id' }
        const segments: Segment[] = [TestEntityFactory.createSegment({ isNext: true }), TestEntityFactory.createSegment({ id: rundownCursor.segmentId })]
        const rundown: Rundown = TestEntityFactory.createRundown({ segments })
        const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
        when(mockedSegmentEntityService.reset(anything())).thenCall(segment => segment)
        when(mockedSegmentEntityService.unmarkSegmentAsNext(anything())).thenCall(segment => segment)
        when(mockedSegmentEntityService.removeUnplannedUnplayedPartsAndPieces(anything())).thenCall(segment => segment)
        const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))

        testee.setNext(rundown, rundownCursor)

        verify(mockedSegmentEntityService.unmarkSegmentAsNext(segments[0])).once()
      })

      it('marks the segment as next', () => {
        const nextSegmentId: string = 'next-segment-id'
        const rundownCursor: RundownCursor = { segmentId: nextSegmentId, partId: 'part-id' }
        const segments: Segment[] = [TestEntityFactory.createSegment({ isNext: true }), TestEntityFactory.createSegment({ id: rundownCursor.segmentId })]
        const rundown: Rundown = TestEntityFactory.createRundown({ segments })
        const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
        when(mockedSegmentEntityService.reset(anything())).thenCall(segment => segment)
        when(mockedSegmentEntityService.unmarkSegmentAsNext(anything())).thenCall(segment => segment)
        when(mockedSegmentEntityService.removeUnplannedUnplayedPartsAndPieces(anything())).thenCall(segment => segment)
        const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))

        testee.setNext(rundown, rundownCursor)

        verify(mockedSegmentEntityService.setAsNextSegment(segments[1], rundownCursor.partId)).once()
      })
    })
  })

  describe(RundownEntityService.prototype.updateInfinitePieces.name, () => {
    describe('when an already existing infinite piece is added', () => {
      it('overwrites the previous one', () => {
        const infinitePiece: Piece = TestEntityFactory.createPiece({ id: 'some-id', name: 'some-name' })
        const rundown: Rundown = TestEntityFactory.createRundown({ infinitePieces: [infinitePiece] })
        const updatedInfinitePiece: Piece = { ...infinitePiece, name: 'some-other-name' }
        const testee: RundownEntityService = createTestee()

        expect(rundown.infinitePieces).toContain(infinitePiece)
        expect(rundown.infinitePieces).not.toContain(updatedInfinitePiece)

        const result: Rundown = testee.updateInfinitePieces(rundown, [updatedInfinitePiece])

        expect(result.infinitePieces).not.toContain(infinitePiece)
        expect(result.infinitePieces).toContain(updatedInfinitePiece)
      })
    })
    describe('when a non-existing infinite piece is added', () => {
      it('is added to the rundown', () => {
        const infinitePiece: Piece = TestEntityFactory.createPiece({ id: 'some-id' })
        const rundown: Rundown = TestEntityFactory.createRundown({ infinitePieces: [] })
        const testee: RundownEntityService = createTestee()

        expect(rundown.infinitePieces).not.toContain(infinitePiece)

        const result: Rundown = testee.updateInfinitePieces(rundown, [infinitePiece])

        expect(result.infinitePieces).toContain(infinitePiece)
      })
    })
  })

  describe(RundownEntityService.prototype.insertPartAsOnAir.name, () => {
    it('inserts the part as on-air', () => {
      const newPart: Part = TestEntityFactory.createPart()
      const onAirPart: Part = TestEntityFactory.createPart({ isOnAir: true })
      const segment: Segment = TestEntityFactory.createSegment({ isOnAir: true, parts: [onAirPart] })
      const rundown: Rundown = TestEntityFactory.createRundown({ segments: [segment] })
      const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
      when(mockedSegmentEntityService.takeOffAir(anything(), anyNumber())).thenCall(segment => segment)
      when(mockedSegmentEntityService.insertPartAsOnAir(anything(), anything(), anyNumber())).thenCall(segment => segment)
      const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))

      testee.insertPartAsOnAir(rundown, newPart, Date.now())

      verify(mockedSegmentEntityService.insertPartAsOnAir(segment, newPart, anyNumber())).once()
    })
  })

  describe(RundownEntityService.prototype.insertPartAsNext.name, () => {
    describe('when segment is marked as next', () => {
      it('unmarks the segment before inserting the part as next', () => {
        const newPart: Part = TestEntityFactory.createPart()
        const onAirPart: Part = TestEntityFactory.createPart({ isOnAir: true })
        const segment: Segment = TestEntityFactory.createSegment({ isOnAir: true, isNext: true, parts: [onAirPart] })
        const rundown: Rundown = TestEntityFactory.createRundown({ segments: [segment] })
        const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
        when(mockedSegmentEntityService.unmarkSegmentAsNext(anything())).thenCall(segment => segment)
        when(mockedSegmentEntityService.insertPartAsNext(anything(), anything())).thenCall(segment => segment)
        const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))

        testee.insertPartAsNext(rundown, newPart)

        verify(mockedSegmentEntityService.unmarkSegmentAsNext(segment)).calledBefore(mockedSegmentEntityService.insertPartAsNext(segment, newPart))
      })
    })

    describe('when segment is not marked as next', () => {
      it('unmarks the current next segment as next before inserting the part as next', () => {
        const newPart: Part = TestEntityFactory.createPart()
        const onAirPart: Part = TestEntityFactory.createPart({ isOnAir: true })
        const segment: Segment = TestEntityFactory.createSegment({ isOnAir: true, isNext: false, parts: [onAirPart] })
        const nextSegment: Segment = TestEntityFactory.createSegment({ isNext: true })
        const rundown: Rundown = TestEntityFactory.createRundown({ segments: [segment, nextSegment] })
        const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
        when(mockedSegmentEntityService.unmarkSegmentAsNext(anything())).thenCall(segment => segment)
        when(mockedSegmentEntityService.insertPartAsNext(anything(), anything())).thenCall(segment => segment)
        const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))

        testee.insertPartAsNext(rundown, newPart)

        verify(mockedSegmentEntityService.unmarkSegmentAsNext(nextSegment)).calledBefore(mockedSegmentEntityService.insertPartAsNext(segment, newPart))
      })
    })
  })
})

function createTestee(maybeSegmentService?: SegmentEntityService): RundownEntityService {
  const segmentService: SegmentEntityService = maybeSegmentService ?? instance(mock<SegmentEntityService>())
  return new RundownEntityService(segmentService)
}
