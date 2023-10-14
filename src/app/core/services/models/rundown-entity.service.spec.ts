import { RundownEntityService } from './rundown-entity.service'
import { SegmentEntityService } from './segment-entity.service'
import { anyNumber, anyString, anything, instance, mock, verify, when } from '@typestrong/ts-mockito'
import { Rundown } from '../../models/rundown'
import { TestEntityFactory } from './test-entity.factory'
import { Segment } from '../../models/segment'
import { Piece } from '../../models/piece'
import { RundownCursor } from '../../models/rundown-cursor'

describe(RundownEntityService.name, () => {
  describe(RundownEntityService.prototype.activate.name, () => {
    it('resets all segments', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const segments: Segment[] = [testEntityFactory.createSegment(), testEntityFactory.createSegment(), testEntityFactory.createSegment()]
      const rundown: Rundown = testEntityFactory.createRundown({ segments })
      const mockedSegmentEntityService = mock<SegmentEntityService>()
      when(mockedSegmentEntityService.reset(anything())).thenCall(segment => segment)
      const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))

      testee.activate(rundown)

      segments.forEach(segment => verify(mockedSegmentEntityService.reset(segment)).once())
    })

    it('marks rundown as active', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const rundown: Rundown = testEntityFactory.createRundown()
      const testee: RundownEntityService = createTestee()

      const result: Rundown = testee.activate(rundown)

      expect(rundown.isActive).toBeFalse()
      expect(result.isActive).toBeTrue()
    })

    it('does not put any segments on-air', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const segments: Segment[] = [testEntityFactory.createSegment(), testEntityFactory.createSegment(), testEntityFactory.createSegment()]
      const rundown: Rundown = testEntityFactory.createRundown({ segments })
      const mockedSegmentEntityService = mock<SegmentEntityService>()
      when(mockedSegmentEntityService.reset(anything())).thenCall(segment => segment)
      const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))

      testee.activate(rundown)

      verify(mockedSegmentEntityService.putOnAir(anything(), anyString(), anyNumber())).never()
    })
  })

  describe(RundownEntityService.prototype.deactivate.name, () => {
    it('marks rundown as inactive', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const rundown = testEntityFactory.createRundown({ isActive: true })
      const testee: RundownEntityService = createTestee()

      const result: Rundown = testee.deactivate(rundown, Date.now())

      expect(rundown.isActive).toBeTrue()
      expect(result.isActive).toBeFalse()
    })

    it('takes all segments off-air', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const segments = [testEntityFactory.createSegment(), testEntityFactory.createSegment(), testEntityFactory.createSegment()]
      const rundown = testEntityFactory.createRundown({ isActive: true, segments })
      const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
      when(mockedSegmentEntityService.takeOffAir(anything(), anyNumber())).thenCall(segment => segment)
      const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))

      const deactivatedAt: number = Date.now()
      testee.deactivate(rundown, deactivatedAt)

      segments.forEach(segment => verify(mockedSegmentEntityService.takeOffAir(segment, deactivatedAt)))
    })

    it('unmarks segments set as next', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const segments: Segment[] = [testEntityFactory.createSegment(), testEntityFactory.createSegment({ isNext: true }), testEntityFactory.createSegment()]
      const rundown: Rundown = testEntityFactory.createRundown({ segments })
      const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
      when(mockedSegmentEntityService.takeOffAir(anything(), anyNumber())).thenCall(segment => segment)
      const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))

      testee.deactivate(rundown, Date.now())

      verify(mockedSegmentEntityService.removeAsNextSegment(segments[1])).once()
    })

    it('clears infinite pieces', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const infinitePieces: Piece[] = [testEntityFactory.createPiece(), testEntityFactory.createPiece(), testEntityFactory.createPiece()]
      const rundown: Rundown = testEntityFactory.createRundown({ infinitePieces })
      const testee: RundownEntityService = createTestee()

      const result: Rundown = testee.deactivate(rundown, Date.now())

      expect(rundown.infinitePieces).toBe(infinitePieces)
      expect(result.infinitePieces).toEqual([])
    })
  })

  describe(RundownEntityService.prototype.takeNext.name, () => {
    describe('when given a rundown cursor that points to an already on-air segment', () => {
      it('marks the segment as off-air', () => {
        const rundownCursor: RundownCursor = {
          segmentId: 'segment-id',
          partId: 'part-id',
        }
        const testEntityFactory: TestEntityFactory = new TestEntityFactory()
        const segment: Segment = testEntityFactory.createSegment({ id: rundownCursor.segmentId, isOnAir: true, isNext: true })
        const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments: [segment] })
        const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
        when(mockedSegmentEntityService.takeOffAir(anything(), anyNumber())).thenCall(segment => segment)
        const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))
        const takenAt: number = Date.now()

        testee.takeNext(rundown, rundownCursor, takenAt)

        verify(mockedSegmentEntityService.takeOffAir(segment, takenAt)).once()
      })

      it('puts segment on-air', () => {
        const rundownCursor: RundownCursor = {
          segmentId: 'segment-id',
          partId: 'part-id',
        }
        const testEntityFactory: TestEntityFactory = new TestEntityFactory()
        const segment: Segment = testEntityFactory.createSegment({ id: rundownCursor.segmentId, isOnAir: true, isNext: true })
        const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments: [segment] })
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
        const testEntityFactory: TestEntityFactory = new TestEntityFactory()
        const nextSegmentId: string = 'next-segment-id'
        const rundownCursor: RundownCursor = {
          segmentId: nextSegmentId,
          partId: 'next-part-id',
        }
        const segments: Segment[] = [testEntityFactory.createSegment({ id: 'segment1', isOnAir: true }), testEntityFactory.createSegment({ id: nextSegmentId, isNext: true })]
        const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments })
        const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
        when(mockedSegmentEntityService.takeOffAir(anything(), anyNumber())).thenCall(() => testEntityFactory.createSegment())
        const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))

        const takenAt: number = Date.now()
        testee.takeNext(rundown, rundownCursor, takenAt)

        verify(mockedSegmentEntityService.takeOffAir(segments[0], takenAt)).once()
      })

      it('puts segment on-air', () => {
        const testEntityFactory: TestEntityFactory = new TestEntityFactory()
        const nextSegmentId: string = 'next-segment-id'
        const nextPartId: string = 'next-part-id'
        const segment: Segment = testEntityFactory.createSegment({ id: nextSegmentId })
        const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments: [segment] })
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
        const testEntityFactory: TestEntityFactory = new TestEntityFactory()
        const rundownCursor: RundownCursor = { segmentId: 'next-segment-id', partId: 'part-id' }
        const segment: Segment = testEntityFactory.createSegment({ id: rundownCursor.segmentId, isOnAir: true, isNext: true })
        const rundown: Rundown = testEntityFactory.createRundown({ segments: [segment] })
        const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
        when(mockedSegmentEntityService.removeAsNextSegment(anything())).thenCall(segment => segment)
        const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))

        testee.setNext(rundown, rundownCursor)

        verify(mockedSegmentEntityService.reset(segment)).never()
      })

      it('unmarks previous set-as-next part as next and then marks next part', () => {
        const testEntityFactory: TestEntityFactory = new TestEntityFactory()
        const rundownCursor: RundownCursor = { segmentId: 'next-segment-id', partId: 'part-id' }
        const segment: Segment = testEntityFactory.createSegment({ id: rundownCursor.segmentId, isOnAir: true, isNext: true })
        const rundown: Rundown = testEntityFactory.createRundown({ segments: [segment] })
        const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
        when(mockedSegmentEntityService.removeAsNextSegment(anything())).thenCall(segment => segment)
        const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))

        testee.setNext(rundown, rundownCursor)

        verify(mockedSegmentEntityService.removeAsNextSegment(segment)).once()
        verify(mockedSegmentEntityService.setAsNextSegment(segment, rundownCursor.partId)).once()
        verify(mockedSegmentEntityService.setAsNextSegment(segment, rundownCursor.partId)).calledAfter(mockedSegmentEntityService.removeAsNextSegment(segment))
      })
    })

    describe('when given next cursor targeting off-air segment', () => {
      it('resets the segment', () => {
        const testEntityFactory: TestEntityFactory = new TestEntityFactory()
        const segmentId: string = 'segment-id'
        const segment: Segment = testEntityFactory.createSegment()
        const rundown: Rundown = testEntityFactory.createRundown({ segments: [segment] })
        const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
        when(mockedSegmentEntityService.reset(anything())).thenCall(segment => segment)
        const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))
        const rundownCursor: RundownCursor = { segmentId, partId: 'part-id' }

        testee.setNext(rundown, rundownCursor)

        verify(mockedSegmentEntityService.reset(segment)).once()
      })

      it('unmarks the previous set-as-next segment as next', () => {
        const testEntityFactory: TestEntityFactory = new TestEntityFactory()
        const nextSegmentId: string = 'next-segment-id'
        const rundownCursor: RundownCursor = { segmentId: nextSegmentId, partId: 'part-id' }
        const segments: Segment[] = [testEntityFactory.createSegment({ isNext: true }), testEntityFactory.createSegment({ id: rundownCursor.segmentId })]
        const rundown: Rundown = testEntityFactory.createRundown({ segments })
        const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
        when(mockedSegmentEntityService.reset(anything())).thenCall(segment => segment)
        when(mockedSegmentEntityService.removeAsNextSegment(anything())).thenCall(segment => segment)
        const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))

        testee.setNext(rundown, rundownCursor)

        verify(mockedSegmentEntityService.removeAsNextSegment(segments[0])).once()
      })

      it('marks the segment as next', () => {
        const testEntityFactory: TestEntityFactory = new TestEntityFactory()
        const nextSegmentId: string = 'next-segment-id'
        const rundownCursor: RundownCursor = { segmentId: nextSegmentId, partId: 'part-id' }
        const segments: Segment[] = [testEntityFactory.createSegment({ isNext: true }), testEntityFactory.createSegment({ id: rundownCursor.segmentId })]
        const rundown: Rundown = testEntityFactory.createRundown({ segments })
        const mockedSegmentEntityService: SegmentEntityService = mock<SegmentEntityService>()
        when(mockedSegmentEntityService.reset(anything())).thenCall(segment => segment)
        when(mockedSegmentEntityService.removeAsNextSegment(anything())).thenCall(segment => segment)
        const testee: RundownEntityService = createTestee(instance(mockedSegmentEntityService))

        testee.setNext(rundown, rundownCursor)

        verify(mockedSegmentEntityService.setAsNextSegment(segments[1], rundownCursor.partId)).once()
      })
    })
  })

  describe(RundownEntityService.prototype.addInfinitePiece.name, () => {
    describe('when an already existing infinite piece is added', () => {
      it('overwrites the previous one', () => {
        const testEntityFactory: TestEntityFactory = new TestEntityFactory()
        const infinitePiece: Piece = testEntityFactory.createPiece({ id: 'some-id', name: 'some-name' })
        const rundown: Rundown = testEntityFactory.createRundown({ infinitePieces: [infinitePiece] })
        const updatedInfinitePiece: Piece = { ...infinitePiece, name: 'some-other-name' }
        const testee: RundownEntityService = createTestee()

        expect(rundown.infinitePieces).toContain(infinitePiece)
        expect(rundown.infinitePieces).not.toContain(updatedInfinitePiece)

        const result: Rundown = testee.addInfinitePiece(rundown, updatedInfinitePiece)

        expect(result.infinitePieces).not.toContain(infinitePiece)
        expect(result.infinitePieces).toContain(updatedInfinitePiece)
      })
    })
    describe('when a non-existing infinite piece is added', () => {
      it('is added to the rundown', () => {
        const testEntityFactory: TestEntityFactory = new TestEntityFactory()
        const infinitePiece: Piece = testEntityFactory.createPiece({ id: 'some-id' })
        const rundown: Rundown = testEntityFactory.createRundown({ infinitePieces: [] })
        const testee: RundownEntityService = createTestee()

        expect(rundown.infinitePieces).not.toContain(infinitePiece)

        const result: Rundown = testee.addInfinitePiece(rundown, infinitePiece)

        expect(result.infinitePieces).toContain(infinitePiece)
      })
    })
  })
})

function createTestee(maybeSegmentService?: SegmentEntityService): RundownEntityService {
  const segmentService: SegmentEntityService = maybeSegmentService ?? instance(mock<SegmentEntityService>())
  return new RundownEntityService(segmentService)
}
