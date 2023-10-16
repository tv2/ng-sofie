import { SegmentEntityService } from './segment-entity.service'
import { TestEntityFactory } from './test-entity.factory'
import { Segment } from '../../models/segment'
import { PartEntityService } from './part-entity.service'
import { anyNumber, anything, instance, mock, verify, when } from '@typestrong/ts-mockito'
import { Part } from '../../models/part'

describe(SegmentEntityService.name, () => {
  describe(SegmentEntityService.prototype.putOnAir.name, () => {
    describe('when given an off-air segment', () => {
      it('marks segment as on-air', () => {
        const testEntityFactory: TestEntityFactory = new TestEntityFactory()
        const segment: Segment = testEntityFactory.createSegment()
        const partId: string = 'part-id'
        const testee: SegmentEntityService = createTestee()

        const result: Segment = testee.putOnAir(segment, partId, Date.now())

        expect(segment.isOnAir).toBeFalse()
        expect(result.isOnAir).toBeTrue()
      })

      it('marks part as on-air', () => {
        const testEntityFactory: TestEntityFactory = new TestEntityFactory()
        const partId: string = 'part2'
        const parts: Part[] = [testEntityFactory.createPart({ id: 'part1' }), testEntityFactory.createPart({ id: partId }), testEntityFactory.createPart({ id: 'part3' })]
        const segment: Segment = testEntityFactory.createSegment({ parts })
        const mockedPartService: PartEntityService = mock<PartEntityService>()
        const testee: SegmentEntityService = createTestee(instance(mockedPartService))
        const timestamp: number = Date.now()

        testee.putOnAir(segment, partId, timestamp)

        verify(mockedPartService.putOnAir(parts[1], timestamp)).once()
      })
    })
  })

  describe(SegmentEntityService.prototype.takeOffAir.name, () => {
    describe('when given an on-air segment', () => {
      it('marks segment as off-air', () => {
        const testEntityFactory: TestEntityFactory = new TestEntityFactory()
        const segment: Segment = testEntityFactory.createSegment({ isOnAir: true })
        const testee: SegmentEntityService = createTestee()

        const result: Segment = testee.takeOffAir(segment, Date.now())

        expect(segment.isOnAir).toBeTrue()
        expect(result.isOnAir).toBeFalse()
      })

      it('marks on-air part as off-air', () => {
        const testEntityFactory: TestEntityFactory = new TestEntityFactory()
        const parts: Part[] = [testEntityFactory.createPart({ id: 'part1' }), testEntityFactory.createPart({ id: 'part2', isOnAir: true }), testEntityFactory.createPart({ id: 'part3' })]
        const segment: Segment = testEntityFactory.createSegment({ isOnAir: true, parts })
        const mockedPartService: PartEntityService = mock<PartEntityService>()
        const testee: SegmentEntityService = createTestee(instance(mockedPartService))
        const timestamp: number = Date.now()

        testee.takeOffAir(segment, timestamp)

        verify(mockedPartService.takeOffAir(parts[1], timestamp)).once()
      })
    })
  })

  describe(SegmentEntityService.prototype.setAsNextSegment.name, () => {
    it('marks segment as next', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const segment: Segment = testEntityFactory.createSegment()
      const partId: string = 'part-id'
      const testee: SegmentEntityService = createTestee()

      const result: Segment = testee.setAsNextSegment(segment, partId)

      expect(segment.isNext).toBeFalse()
      expect(result.isNext).toBeTrue()
    })

    it('marks part as next', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const partId: string = 'part2'
      const parts: Part[] = [testEntityFactory.createPart({ id: 'part1' }), testEntityFactory.createPart({ id: partId }), testEntityFactory.createPart({ id: 'part3' })]
      const segment: Segment = testEntityFactory.createSegment({ parts })
      const mockedPartService: PartEntityService = mock<PartEntityService>()
      const testee: SegmentEntityService = createTestee(instance(mockedPartService))

      testee.setAsNextSegment(segment, partId)

      verify(mockedPartService.setAsNextPart(parts[1])).once()
    })
  })

  describe(SegmentEntityService.prototype.unmarkSegmentAsNext.name, () => {
    it('unmarks segment as next', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const segment: Segment = testEntityFactory.createSegment({ isNext: true })
      const testee: SegmentEntityService = createTestee()

      const result: Segment = testee.unmarkSegmentAsNext(segment)

      expect(segment.isNext).toBeTrue()
      expect(result.isNext).toBeFalse()
    })

    it('unmarks part as next', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const parts: Part[] = [testEntityFactory.createPart({ id: 'part1' }), testEntityFactory.createPart({ id: 'part2', isNext: true }), testEntityFactory.createPart({ id: 'part3' })]
      const segment: Segment = testEntityFactory.createSegment({ parts })
      const mockedPartService: PartEntityService = mock<PartEntityService>()
      const testee: SegmentEntityService = createTestee(instance(mockedPartService))

      testee.unmarkSegmentAsNext(segment)

      verify(mockedPartService.unmarkPartAsNext(parts[1])).once()
    })
  })

  describe(SegmentEntityService.prototype.reset.name, () => {
    it('resets all parts', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const parts: Part[] = [testEntityFactory.createPart(), testEntityFactory.createPart(), testEntityFactory.createPart()]
      const segment: Segment = testEntityFactory.createSegment({ parts })
      const mockedPartService: PartEntityService = mock<PartEntityService>()
      const testee: SegmentEntityService = createTestee(instance(mockedPartService))

      testee.reset(segment)

      parts.forEach(part => verify(mockedPartService.reset(part)).once())
    })
  })

  describe(SegmentEntityService.prototype.insertPartAsOnAir.name, () => {
    describe('when a planned part is on air', () => {
      describe('when the planned on-air part is the last in segment', () => {
        it('inserts the part as on-air after the planned on-air part', () => {
          const testEntityFactory: TestEntityFactory = new TestEntityFactory()
          const plannedOnAirPart: Part = testEntityFactory.createPart({ isOnAir: true, isPlanned: true })
          const newPart: Part = testEntityFactory.createPart({ isPlanned: false })
          const segment: Segment = testEntityFactory.createSegment({ parts: [plannedOnAirPart] })
          const testee: SegmentEntityService = createTestee()

          const result: Segment = testee.insertPartAsOnAir(segment, newPart, Date.now())

          expect(result.parts[1]).toEqual(newPart)
        })

        it('takes the planned on-air part off-air', () => {
          const testEntityFactory: TestEntityFactory = new TestEntityFactory()
          const plannedOnAirPart: Part = testEntityFactory.createPart({ isOnAir: true, isPlanned: true })
          const newPart: Part = testEntityFactory.createPart({ isPlanned: false })
          const segment: Segment = testEntityFactory.createSegment({ parts: [plannedOnAirPart] })
          const mockedPartEntityService: PartEntityService = mock<PartEntityService>()
          const testee: SegmentEntityService = createTestee(instance(mockedPartEntityService))

          testee.insertPartAsOnAir(segment, newPart, Date.now())

          verify(mockedPartEntityService.takeOffAir(plannedOnAirPart, anyNumber())).once()
        })
      })

      describe('when the planned on-air part is succeeded by another part', () => {
        it('inserts the part as on-air after the planned on-air part', () => {
          const testEntityFactory: TestEntityFactory = new TestEntityFactory()
          const plannedOnAirPart: Part = testEntityFactory.createPart({ isOnAir: true, isPlanned: true })
          const newPart: Part = testEntityFactory.createPart({ isPlanned: false })
          const anotherPart: Part = testEntityFactory.createPart()
          const segment: Segment = testEntityFactory.createSegment({ parts: [plannedOnAirPart, anotherPart] })
          const testee: SegmentEntityService = createTestee()

          const result: Segment = testee.insertPartAsOnAir(segment, newPart, Date.now())

          expect(result.parts[1]).toEqual(newPart)
        })

        it('takes the planned on-air part off-air', () => {
          const testEntityFactory: TestEntityFactory = new TestEntityFactory()
          const plannedOnAirPart: Part = testEntityFactory.createPart({ isOnAir: true, isPlanned: true })
          const newPart: Part = testEntityFactory.createPart({ isPlanned: false })
          const anotherPart: Part = testEntityFactory.createPart()
          const segment: Segment = testEntityFactory.createSegment({ parts: [plannedOnAirPart, anotherPart] })
          const mockedPartEntityService: PartEntityService = mock<PartEntityService>()
          const testee: SegmentEntityService = createTestee(instance(mockedPartEntityService))

          testee.insertPartAsOnAir(segment, newPart, Date.now())

          verify(mockedPartEntityService.takeOffAir(plannedOnAirPart, anyNumber())).once()
        })
      })
    })

    describe('when an unplanned part is on air', () => {
      describe('when the unplanned on-air part is the last in segment', () => {
        it('inserts the part as on-air after the unplanned on-air part', () => {
          const testEntityFactory: TestEntityFactory = new TestEntityFactory()
          const unplannedOnAirPart: Part = testEntityFactory.createPart({ isOnAir: true, isPlanned: false })
          const newPart: Part = testEntityFactory.createPart({ isPlanned: false })
          const segment: Segment = testEntityFactory.createSegment({ parts: [unplannedOnAirPart] })
          const testee: SegmentEntityService = createTestee()

          const result: Segment = testee.insertPartAsOnAir(segment, newPart, Date.now())

          expect(result.parts[1]).toEqual(newPart)
        })

        it('takes the unplanned on-air part off-air', () => {
          const testEntityFactory: TestEntityFactory = new TestEntityFactory()
          const unplannedOnAirPart: Part = testEntityFactory.createPart({ isOnAir: true, isPlanned: false })
          const newPart: Part = testEntityFactory.createPart({ isPlanned: false })
          const segment: Segment = testEntityFactory.createSegment({ parts: [unplannedOnAirPart] })
          const mockedPartEntityService: PartEntityService = mock<PartEntityService>()
          const testee: SegmentEntityService = createTestee(instance(mockedPartEntityService))

          testee.insertPartAsOnAir(segment, newPart, Date.now())

          verify(mockedPartEntityService.takeOffAir(unplannedOnAirPart, anyNumber())).once()
        })
      })

      describe('when the unplanned on-air part is succeeded by another part', () => {
        it('inserts the part as on-air after the unplanned on-air part', () => {
          const testEntityFactory: TestEntityFactory = new TestEntityFactory()
          const unplannedOnAirPart: Part = testEntityFactory.createPart({ isOnAir: true, isPlanned: false })
          const newPart: Part = testEntityFactory.createPart({ isPlanned: false })
          const anotherPart: Part = testEntityFactory.createPart()
          const segment: Segment = testEntityFactory.createSegment({ parts: [unplannedOnAirPart, anotherPart] })
          const testee: SegmentEntityService = createTestee()

          const result: Segment = testee.insertPartAsOnAir(segment, newPart, Date.now())

          expect(result.parts[1]).toEqual(newPart)
        })

        it('takes the unplanned on-air part off-air', () => {
          const testEntityFactory: TestEntityFactory = new TestEntityFactory()
          const unplannedOnAirPart: Part = testEntityFactory.createPart({ isOnAir: true, isPlanned: false })
          const newPart: Part = testEntityFactory.createPart({ isPlanned: false })
          const anotherPart: Part = testEntityFactory.createPart()
          const segment: Segment = testEntityFactory.createSegment({ parts: [unplannedOnAirPart, anotherPart] })
          const mockedPartEntityService: PartEntityService = mock<PartEntityService>()
          const testee: SegmentEntityService = createTestee(instance(mockedPartEntityService))

          testee.insertPartAsOnAir(segment, newPart, Date.now())

          verify(mockedPartEntityService.takeOffAir(unplannedOnAirPart, anyNumber())).once()
        })
      })
    })
  })

  describe(SegmentEntityService.prototype.insertPartAsNext.name, () => {
    describe('when next part is nonadjacent to on-air part', () => {
      describe('when next part is in same segment', () => {
        it('it inserts the new part after the on-air part', () => {
          const testEntityFactory: TestEntityFactory = new TestEntityFactory()
          const onAirPart: Part = testEntityFactory.createPart({ id: 'on-air-part-id', isOnAir: true })
          const nextPart: Part = testEntityFactory.createPart({ id: 'next-part-id', isNext: true })
          const newPart: Part = testEntityFactory.createPart({ id: 'new-part-id', isNext: true })
          const segment: Segment = testEntityFactory.createSegment({ parts: [onAirPart, nextPart] })
          const testee: SegmentEntityService = createTestee()

          const result: Segment = testee.insertPartAsNext(segment, newPart)

          expect(result.parts[1]).toEqual(newPart)
        })

        it('unmarks the next nonadjacent next part as next', () => {
          const testEntityFactory: TestEntityFactory = new TestEntityFactory()
          const onAirPart: Part = testEntityFactory.createPart({ id: 'on-air-part-id', isOnAir: true })
          const nextPart: Part = testEntityFactory.createPart({ id: 'next-part-id', isNext: true })
          const newPart: Part = testEntityFactory.createPart({ id: 'new-part-id', isNext: true })
          const segment: Segment = testEntityFactory.createSegment({ parts: [onAirPart, nextPart] })
          const mockedPartEntityService: PartEntityService = mock<PartEntityService>()
          const testee: SegmentEntityService = createTestee(instance(mockedPartEntityService))

          testee.insertPartAsNext(segment, newPart)

          verify(mockedPartEntityService.unmarkPartAsNext(nextPart)).once()
        })
      })
    })

    describe('when next part is adjacent to on-air part', () => {
      describe('when next part is planned', () => {
        it('inserts the new part in between the on-air part and the adjacent next part', () => {
          const testEntityFactory: TestEntityFactory = new TestEntityFactory()
          const onAirPart: Part = testEntityFactory.createPart({ id: 'on-air-part-id', isOnAir: true })
          const nextPart: Part = testEntityFactory.createPart({ id: 'next-part-id', isNext: true, isPlanned: true })
          const newPart: Part = testEntityFactory.createPart({ id: 'new-part-id', isNext: true })
          const segment: Segment = testEntityFactory.createSegment({ parts: [onAirPart, nextPart] })
          const mockedPartEntitySegment: PartEntityService = mock<PartEntityService>()
          when(mockedPartEntitySegment.unmarkPartAsNext(anything())).thenCall(part => part)
          const testee: SegmentEntityService = createTestee(instance(mockedPartEntitySegment))

          const result: Segment = testee.insertPartAsNext(segment, newPart)

          expect(result.parts[1]).toEqual(newPart)
          expect(result.parts[2]).toEqual(nextPart)
        })

        it('unmarks the adjacent next part as next', () => {
          const testEntityFactory: TestEntityFactory = new TestEntityFactory()
          const onAirPart: Part = testEntityFactory.createPart({ id: 'on-air-part-id', isOnAir: true })
          const nextPart: Part = testEntityFactory.createPart({ id: 'next-part-id', isNext: true, isPlanned: true })
          const newPart: Part = testEntityFactory.createPart({ id: 'new-part-id', isNext: true })
          const segment: Segment = testEntityFactory.createSegment({ parts: [onAirPart, nextPart] })
          const mockedPartEntitySegment: PartEntityService = mock<PartEntityService>()
          when(mockedPartEntitySegment.unmarkPartAsNext(anything())).thenCall(part => part)
          const testee: SegmentEntityService = createTestee(instance(mockedPartEntitySegment))

          testee.insertPartAsNext(segment, newPart)

          verify(mockedPartEntitySegment.unmarkPartAsNext(nextPart)).once()
        })
      })

      describe('when next part is unplanned', () => {
        it('replaces the unplanned part marked as next', () => {
          const testEntityFactory: TestEntityFactory = new TestEntityFactory()
          const onAirPart: Part = testEntityFactory.createPart({ id: 'on-air-part-id', isOnAir: true })
          const nextPart: Part = testEntityFactory.createPart({ id: 'next-part-id', isNext: true, isPlanned: false })
          const newPart: Part = testEntityFactory.createPart({ id: 'new-part-id', isNext: true })
          const segment: Segment = testEntityFactory.createSegment({ parts: [onAirPart, nextPart] })
          const mockedPartEntitySegment: PartEntityService = mock<PartEntityService>()
          when(mockedPartEntitySegment.unmarkPartAsNext(anything())).thenCall(part => part)
          const testee: SegmentEntityService = createTestee(instance(mockedPartEntitySegment))

          const result: Segment = testee.insertPartAsNext(segment, newPart)

          expect(result.parts.length).toBe(2)
          expect(result.parts[0]).toEqual(onAirPart)
          expect(result.parts[1]).toEqual(newPart)
        })
      })
    })
  })
})

function createTestee(maybePartService?: PartEntityService): SegmentEntityService {
  const partService: PartEntityService = maybePartService ?? instance(mock<PartEntityService>())
  return new SegmentEntityService(partService)
}
