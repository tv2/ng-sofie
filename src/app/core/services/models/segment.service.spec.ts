import { SegmentService } from './segment.service'
import { TestEntityFactory } from './test-entity.factory'
import { Segment } from '../../_models/segment'
import { PartService } from './part.service'
import { instance, mock, verify } from '@typestrong/ts-mockito'
import { Part } from '../../_models/part'

describe(SegmentService.name, () => {
    describe(SegmentService.prototype.putOnAir.name, () => {
        describe('when given an off-air segment', () => {
            it('marks segment as on-air', () => {
                const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                const segment: Segment = testEntityFactory.createSegment()
                const partId: string = 'part-id'
                const testee: SegmentService = createTestee()

                const result: Segment = testee.putOnAir(segment, partId, Date.now())

                expect(segment.isOnAir).toBeFalse()
                expect(result.isOnAir).toBeTrue()
            })

            it('marks part as on-air', () => {
                const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                const partId: string = 'part2'
                const parts: Part[] = [
                    testEntityFactory.createPart({ id: 'part1' }),
                    testEntityFactory.createPart({ id: partId }),
                    testEntityFactory.createPart({ id: 'part3' }),
                ]
                const segment: Segment = testEntityFactory.createSegment({ parts })
                const mockedPartService: PartService = mock<PartService>()
                const testee: SegmentService = createTestee(instance(mockedPartService))
                const timestamp: number = Date.now()

                testee.putOnAir(segment, partId, timestamp)

                verify(mockedPartService.putOnAir(parts[1], timestamp)).once()
            })
        })
    })

    describe(SegmentService.prototype.takeOffAir.name, () => {
        describe('when given an on-air segment', () => {
            it('marks segment as off-air', () => {
                const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                const segment: Segment = testEntityFactory.createSegment({ isOnAir: true })
                const testee: SegmentService = createTestee()

                const result: Segment = testee.takeOffAir(segment, Date.now())

                expect(segment.isOnAir).toBeTrue()
                expect(result.isOnAir).toBeFalse()
            })

            it('marks on-air part as off-air', () => {
                const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                const parts: Part[] = [
                    testEntityFactory.createPart({ id: 'part1' }),
                    testEntityFactory.createPart({ id: 'part2', isOnAir: true }),
                    testEntityFactory.createPart({ id: 'part3' }),
                ]
                const segment: Segment = testEntityFactory.createSegment({ isOnAir: true, parts })
                const mockedPartService: PartService = mock<PartService>()
                const testee: SegmentService = createTestee(instance(mockedPartService))
                const timestamp: number = Date.now()

                testee.takeOffAir(segment, timestamp)

                verify(mockedPartService.takeOffAir(parts[1], timestamp)).once()
            })
        })
    })

    describe(SegmentService.prototype.setAsNextSegment.name, () => {
        it('marks segment as next', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const segment: Segment = testEntityFactory.createSegment()
            const partId: string = 'part-id'
            const testee: SegmentService = createTestee()

            const result: Segment = testee.setAsNextSegment(segment, partId)

            expect(segment.isNext).toBeFalse()
            expect(result.isNext).toBeTrue()
        })

        it('marks part as next', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const partId: string = 'part2'
            const parts: Part[] = [
                testEntityFactory.createPart({ id: 'part1' }),
                testEntityFactory.createPart({ id: partId }),
                testEntityFactory.createPart({ id: 'part3' }),
            ]
            const segment: Segment = testEntityFactory.createSegment({ parts })
            const mockedPartService: PartService = mock<PartService>()
            const testee: SegmentService = createTestee(instance(mockedPartService))

            testee.setAsNextSegment(segment, partId)

            verify(mockedPartService.setAsNextPart(parts[1])).once()
        })
    })

    describe(SegmentService.prototype.removeAsNextSegment.name, () => {
        it('unmarks segment as next', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const segment: Segment = testEntityFactory.createSegment({ isNext: true })
            const testee: SegmentService = createTestee()

            const result: Segment = testee.removeAsNextSegment(segment)

            expect(segment.isNext).toBeTrue()
            expect(result.isNext).toBeFalse()
        })

        it('unmarks part as next', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const parts: Part[] = [
                testEntityFactory.createPart({ id: 'part1' }),
                testEntityFactory.createPart({ id: 'part2', isNext: true }),
                testEntityFactory.createPart({ id: 'part3' }),
            ]
            const segment: Segment = testEntityFactory.createSegment({ parts })
            const mockedPartService: PartService = mock<PartService>()
            const testee: SegmentService = createTestee(instance(mockedPartService))

            testee.removeAsNextSegment(segment)

            verify(mockedPartService.removeAsNextPart(parts[1])).once()
        })
    })

    describe(SegmentService.prototype.reset.name, () => {
        it('resets all parts', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const parts: Part[] = [
                testEntityFactory.createPart(),
                testEntityFactory.createPart(),
                testEntityFactory.createPart(),
            ]
            const segment: Segment = testEntityFactory.createSegment({ parts })
            const mockedPartService: PartService = mock<PartService>()
            const testee: SegmentService = createTestee(instance(mockedPartService))

            testee.reset(segment)

            parts.forEach(part => verify(mockedPartService.reset(part)).once())
        })
    })
})

function createTestee(maybePartService?: PartService): SegmentService {
    const partService: PartService = maybePartService ?? instance(mock<PartService>())
    return new SegmentService(partService)
}
