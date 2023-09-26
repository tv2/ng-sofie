import { RundownEntityService } from './rundown-entity.service'
import { SegmentEntityService } from './segment-entity.service'
import { anyNumber, anything, instance, mock, verify, when } from '@typestrong/ts-mockito'
import { Rundown } from '../../_models/rundown'
import { TestEntityFactory } from './test-entity.factory'
import { Segment } from '../../_models/segment'
import { Part } from '../../_models/part'
import { Piece } from '../../_models/piece'
import { RundownCursor } from '../../_models/rundown-cursor'

describe(RundownEntityService.name, () => {
    describe(RundownEntityService.prototype.activate.name, () => {
        it('resets all segments', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const segments: Segment[] = [
                testEntityFactory.createSegment(),
                testEntityFactory.createSegment(),
                testEntityFactory.createSegment(),
            ]
            const rundown: Rundown = testEntityFactory.createRundown({ segments })
            const mockedSegmentService = mock<SegmentEntityService>()
            const testee: RundownEntityService = createTestee(instance(mockedSegmentService))

            testee.activate(rundown, Date.now())

            segments.forEach(segment => verify(mockedSegmentService.reset(segment)).once())
        })

        it('marks rundown as active', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const rundown: Rundown = testEntityFactory.createRundown()
            const testee: RundownEntityService = createTestee()

            const result: Rundown = testee.activate(rundown, Date.now())

            expect(rundown.isActive).toBeFalse()
            expect(result.isActive).toBeTrue()
        })

        it('puts first part in first segment on-air', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const firstPartId: string = 'first-part-id'
            const firstPart: Part = testEntityFactory.createPart({ id: firstPartId })
            const firstSegmentId: string = 'first-segment-id'
            const firstSegment: Segment = testEntityFactory.createSegment({ id: firstSegmentId, parts: [firstPart] })
            const rundown: Rundown = testEntityFactory.createRundown({ segments: [firstSegment] })
            const mockedSegmentService = mock<SegmentEntityService>()
            const testee: RundownEntityService = createTestee(instance(mockedSegmentService))
            const activatedAt: number = Date.now()

            testee.activate(rundown, activatedAt)

            verify(mockedSegmentService.putOnAir(firstSegment, firstPartId, activatedAt)).once()
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
            const segments = [
                testEntityFactory.createSegment(),
                testEntityFactory.createSegment(),
                testEntityFactory.createSegment(),
            ]
            const rundown = testEntityFactory.createRundown({ isActive: true, segments })
            const mockedSegmentService: SegmentEntityService = mock<SegmentEntityService>()
            const testee: RundownEntityService = createTestee(instance(mockedSegmentService))

            const deactivatedAt: number = Date.now()
            testee.deactivate(rundown, deactivatedAt)

            segments.forEach(segment => verify(mockedSegmentService.takeOffAir(segment, deactivatedAt)))
        })

        it('clears infinite pieces', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const infinitePieces: Record<string, Piece> = {
                layer1: testEntityFactory.createPiece(),
                layer2: testEntityFactory.createPiece(),
                layer3: testEntityFactory.createPiece(),
            }
            const rundown: Rundown = testEntityFactory.createRundown({ infinitePieces })
            const testee: RundownEntityService = createTestee()

            const result: Rundown = testee.deactivate(rundown, Date.now())

            expect(rundown.infinitePieces).toBe(infinitePieces)
            expect(result.infinitePieces).toEqual({})
        })
    })

    describe(RundownEntityService.prototype.takeNext.name, () => {
        describe('when given a rundown cursor that points to an already on-air segment', () => {
            it('does not take off-air the segment', () => {
                const rundownCursor: RundownCursor = {
                    segmentId: 'segment-id',
                    partId: 'part-id',
                }
                const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                const segment: Segment = testEntityFactory.createSegment({ id: rundownCursor.segmentId, isOnAir: true, isNext: true })
                const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments: [segment] })
                const mockedSegmentService: SegmentEntityService = mock<SegmentEntityService>()
                const testee: RundownEntityService = createTestee(instance(mockedSegmentService))
                const takenAt: number = Date.now()

                testee.takeNext(rundown, rundownCursor, takenAt)

                verify(mockedSegmentService.takeOffAir(segment, takenAt)).never()
            })

            it('puts segment on-air', () => {
                const rundownCursor: RundownCursor = {
                    segmentId: 'segment-id',
                    partId: 'part-id',
                }
                const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                const segment: Segment = testEntityFactory.createSegment({ id: rundownCursor.segmentId, isOnAir: true, isNext: true })
                const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments: [segment] })
                const mockedSegmentService: SegmentEntityService = mock<SegmentEntityService>()
                const testee: RundownEntityService = createTestee(instance(mockedSegmentService))
                const takenAt: number = Date.now()

                testee.takeNext(rundown, rundownCursor, takenAt)

                verify(mockedSegmentService.putOnAir(segment, rundownCursor.partId, takenAt)).once()
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
                const segments: Segment[] = [
                    testEntityFactory.createSegment({ id: 'segment1', isOnAir: true }),
                    testEntityFactory.createSegment({ id: nextSegmentId, isNext: true }),
                ]
                const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments })
                const mockedSegmentService: SegmentEntityService = mock<SegmentEntityService>()
                when(mockedSegmentService.takeOffAir(anything(), anyNumber())).thenCall(() => testEntityFactory.createSegment())
                const testee: RundownEntityService = createTestee(instance(mockedSegmentService))

                const takenAt: number = Date.now()
                testee.takeNext(rundown, rundownCursor, takenAt)

                verify(mockedSegmentService.takeOffAir(segments[0], takenAt)).once()
            })

            it('puts segment on-air', () => {
                const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                const nextSegmentId: string = 'next-segment-id'
                const nextPartId: string = 'next-part-id'
                const segment: Segment = testEntityFactory.createSegment({ id: nextSegmentId })
                const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments: [segment] })
                const rundownCursor: RundownCursor = { segmentId: nextSegmentId, partId: nextPartId }

                const mockedSegmentService: SegmentEntityService = mock<SegmentEntityService>()
                const testee: RundownEntityService = createTestee(instance(mockedSegmentService))
                const takenAt: number = Date.now()

                testee.takeNext(rundown, rundownCursor, takenAt)

                verify(mockedSegmentService.putOnAir(segment, nextPartId, takenAt)).once()
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
                const mockedSegmentService: SegmentEntityService = mock<SegmentEntityService>()
                when(mockedSegmentService.removeAsNextSegment(anything())).thenCall(segment => segment)
                const testee: RundownEntityService = createTestee(instance(mockedSegmentService))

                testee.setNext(rundown, rundownCursor)

                verify(mockedSegmentService.reset(segment)).never()
            })

            it('unmarks previous set-as-next part as next and then marks next part', () => {
                const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                const rundownCursor: RundownCursor = { segmentId: 'next-segment-id', partId: 'part-id' }
                const segment: Segment = testEntityFactory.createSegment({ id: rundownCursor.segmentId, isOnAir: true, isNext: true })
                const rundown: Rundown = testEntityFactory.createRundown({ segments: [segment] })
                const mockedSegmentService: SegmentEntityService = mock<SegmentEntityService>()
                when(mockedSegmentService.removeAsNextSegment(anything())).thenCall(segment => segment)
                const testee: RundownEntityService = createTestee(instance(mockedSegmentService))

                testee.setNext(rundown, rundownCursor)

                verify(mockedSegmentService.removeAsNextSegment(segment)).once()
                verify(mockedSegmentService.setAsNextSegment(segment, rundownCursor.partId)).once()
                verify(mockedSegmentService.setAsNextSegment(segment, rundownCursor.partId)).calledAfter(mockedSegmentService.removeAsNextSegment(segment))
            })
        })

        describe('when given next cursor targeting off-air segment', () => {
            it('resets the segment', () => {
                const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                const segmentId: string = 'segment-id'
                const segment: Segment = testEntityFactory.createSegment()
                const rundown: Rundown = testEntityFactory.createRundown({ segments: [segment] })
                const mockedSegmentService: SegmentEntityService = mock<SegmentEntityService>()
                when(mockedSegmentService.reset(anything())).thenCall(segment => segment)
                const testee: RundownEntityService = createTestee(instance(mockedSegmentService))
                const rundownCursor: RundownCursor = { segmentId, partId: 'part-id' }

                testee.setNext(rundown, rundownCursor)

                verify(mockedSegmentService.reset(segment)).once()
            })

            it('unmarks the previous set-as-next segment as next', () => {
                const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                const nextSegmentId: string = 'next-segment-id'
                const rundownCursor: RundownCursor = { segmentId: nextSegmentId, partId: 'part-id' }
                const segments: Segment[] = [
                    testEntityFactory.createSegment({ isNext: true }),
                    testEntityFactory.createSegment({ id: rundownCursor.segmentId }),
                ]
                const rundown: Rundown = testEntityFactory.createRundown({ segments })
                const mockedSegmentService: SegmentEntityService = mock<SegmentEntityService>()
                when(mockedSegmentService.reset(anything())).thenCall(segment => segment)
                when(mockedSegmentService.removeAsNextSegment(anything())).thenCall(segment => segment)
                const testee: RundownEntityService = createTestee(instance(mockedSegmentService))

                testee.setNext(rundown, rundownCursor)

                verify(mockedSegmentService.removeAsNextSegment(segments[0])).once()
            })

            it('marks the segment as next', () => {
                const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                const nextSegmentId: string = 'next-segment-id'
                const rundownCursor: RundownCursor = { segmentId: nextSegmentId, partId: 'part-id' }
                const segments: Segment[] = [
                    testEntityFactory.createSegment({ isNext: true }),
                    testEntityFactory.createSegment({ id: rundownCursor.segmentId }),
                ]
                const rundown: Rundown = testEntityFactory.createRundown({ segments })
                const mockedSegmentService: SegmentEntityService = mock<SegmentEntityService>()
                when(mockedSegmentService.reset(anything())).thenCall(segment => segment)
                when(mockedSegmentService.removeAsNextSegment(anything())).thenCall(segment => segment)
                const testee: RundownEntityService = createTestee(instance(mockedSegmentService))

                testee.setNext(rundown, rundownCursor)

                verify(mockedSegmentService.setAsNextSegment(segments[1], rundownCursor.partId)).once()
            })
        })
    })
})

function createTestee(maybeSegmentService?: SegmentEntityService): RundownEntityService {
    const segmentService: SegmentEntityService = maybeSegmentService ?? instance(mock<SegmentEntityService>())
    return new RundownEntityService(segmentService)
}
