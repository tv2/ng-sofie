import { PartService } from './part.service'
import { Part } from '../../_models/part'
import { TestEntityFactory } from './test-entity.factory'

describe(PartService.name, () => {
    beforeEach(() => {
        jasmine.clock().install()
        jasmine.clock().mockDate()
    })
    afterEach(() => jasmine.clock().uninstall())

    describe(PartService.prototype.putOnAir.name, () => {
        describe('given an off-air part', () => {
            it('resets played duration', () => {
                const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                const part: Part = testEntityFactory.createPart({ playedDuration: 1234 })
                const testee: PartService = new PartService()

                const result: Part = testee.putOnAir(part, Date.now())

                expect(result.playedDuration).toBe(0)
            })

            it('marks part as on-air', () => {
                const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                const part: Part = testEntityFactory.createPart()
                const testee: PartService = new PartService()

                const result: Part = testee.putOnAir(part, Date.now())

                expect(result.isOnAir).toBeTrue()
            })

            it('set when part was executed', () => {
                const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                const part: Part = testEntityFactory.createPart()
                const testee: PartService = new PartService()
                const executedAt: number = Date.now()

                const result: Part = testee.putOnAir(part, executedAt)

                expect(result.executedAt).toBe(executedAt)
            })
        })
    })

    describe(PartService.prototype.takeOffAir.name, () => {
        describe('when given an on-air part', () => {
            it('marks part as off-air', () => {
                const executedAt: number = Date.now()
                const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                const part: Part = testEntityFactory.createPart({ isOnAir: true, executedAt })
                const testee: PartService = new PartService()

                const result: Part = testee.takeOffAir(part, Date.now())

                expect(result.isOnAir).toBeFalse()
            })

            it('sets played duration', () => {
                const executedAt: number = Date.now()
                const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                const part: Part = testEntityFactory.createPart({ isOnAir: true, executedAt })
                const testee: PartService = new PartService()
                const expectedPlayedDuration: number = 6000

                jasmine.clock().tick(expectedPlayedDuration)
                const takenOffAirAt: number = Date.now()
                const result: Part = testee.takeOffAir(part, takenOffAirAt)

                expect(result.playedDuration).toBe(expectedPlayedDuration)

            })
        })
    })

    describe(PartService.prototype.setAsNextPart.name, () => {
        it('marks part as next', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const part: Part = testEntityFactory.createPart()
            const testee: PartService = new PartService()

            const result: Part = testee.setAsNextPart(part)

            expect(result.isNext).toBeTrue()
        })
    })

    describe(PartService.prototype.removeAsNextPart.name, () => {
        it('unmarks part as next', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const part: Part = testEntityFactory.createPart({ isNext: true })
            const testee: PartService = new PartService()

            const result: Part = testee.removeAsNextPart(part)

            expect(result.isNext).toBeFalse()
        })
    })

    describe(PartService.prototype.reset.name, () => {
        it('resets played duration', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const part: Part = testEntityFactory.createPart({ playedDuration: 1234 })
            const testee: PartService = new PartService()

            const result: Part = testee.reset(part)

            expect(result.playedDuration).toBe(0)
        })

        it('resets when part was taken', () => {
            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
            const part: Part = testEntityFactory.createPart({ executedAt: 1234 })
            const testee: PartService = new PartService()

            const result: Part = testee.reset(part)

            expect(result.executedAt).toBe(0)
        })
    })

    describe(PartService.prototype.getDuration.name, () => {
        describe('part is on-air', () => {
            describe('part has auto-next', () => {
                describe('auto-next overlap duration is longer than the time since part was taken', () => {
                    it('returns the auto-next overlap duration', () => {
                        const autoNextOverlapDuration: number = 3456
                        const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                        const part: Part = testEntityFactory.createPart({
                            isOnAir: true,
                            autoNext: { overlap: autoNextOverlapDuration },
                            executedAt: Date.now()
                        })
                        jasmine.clock().tick(100)
                        const testee: PartService = new PartService()

                        const result: number = testee.getDuration(part)

                        expect(result).toBe(autoNextOverlapDuration)
                    })
                })

                describe('auto-next overlap duration is shorter than the time since part was taken', () => {
                    it('returns the time since part was taken', () => {
                        const autoNextOverlapDuration: number = 3456
                        const playedDuration: number = autoNextOverlapDuration + 2000
                        const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                        const part: Part = testEntityFactory.createPart({
                            isOnAir: true,
                            autoNext: { overlap: autoNextOverlapDuration },
                            executedAt: Date.now()
                        })
                        jasmine.clock().tick(playedDuration)
                        const testee: PartService = new PartService()

                        const result: number = testee.getDuration(part)

                        expect(result).toBe(playedDuration)
                    })
                })
            })

            describe('part has manual take next', () => {
                describe('part has expected duration', () => {
                    describe('expected duration is longer than the time since part was taken', () => {
                        it('returns the expected duration', () => {
                            const expectedDuration: number = 3456
                            const playedDuration: number = 2000
                            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                            const part: Part = testEntityFactory.createPart({
                                isOnAir: true,
                                expectedDuration,
                                executedAt: Date.now()
                            })
                            jasmine.clock().tick(playedDuration)
                            const testee: PartService = new PartService()

                            const result: number = testee.getDuration(part)

                            expect(result).toBe(expectedDuration)
                        })
                    })

                    describe('expected duration is shorter than the time since part was taken', () => {
                        it('returns the time since part was taken', () => {
                            const expectedDuration: number = 3456
                            const playedDuration: number = 4000
                            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                            const part: Part = testEntityFactory.createPart({
                                isOnAir: true,
                                expectedDuration,
                                executedAt: Date.now()
                            })
                            jasmine.clock().tick(playedDuration)
                            const testee: PartService = new PartService()

                            const result: number = testee.getDuration(part)

                            expect(result).toBe(playedDuration)
                        })
                    })
                })

                describe('part has no expected duration', () => {
                    describe('default part duration is longer than the time since part was taken', () => {
                        it('returns the default part duration', () => {
                            const testee: PartService = new PartService()
                            const playedDuration: number = testee.defaultPartDurationInMs / 2
                            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                            const part: Part = testEntityFactory.createPart({
                                isOnAir: true,
                                executedAt: Date.now()
                            })
                            jasmine.clock().tick(playedDuration)

                            const result: number = testee.getDuration(part)

                            expect(result).toBe(testee.defaultPartDurationInMs)
                        })
                    })

                    describe('default part duration is shorter than the time since part was taken', () => {
                        it('returns the time since part was taken', () => {
                            const testee: PartService = new PartService()
                            const playedDuration: number = testee.defaultPartDurationInMs + 5000
                            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                            const part: Part = testEntityFactory.createPart({
                                isOnAir: true,
                                executedAt: Date.now()
                            })
                            jasmine.clock().tick(playedDuration)

                            const result: number = testee.getDuration(part)

                            expect(result).toBe(playedDuration)
                        })
                    })
                })
            })
        })

        describe('part is OFF-AIR', () => {
            describe('part has auto-next', () => {
                describe('part has a played duration', () => {
                    it('returns played duration', () => {
                        const autoNextOverlapDuration: number = 3456
                        const playedDuration: number = 1234
                        const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                        const part: Part = testEntityFactory.createPart({
                            isOnAir: false,
                            autoNext: { overlap: autoNextOverlapDuration },
                            playedDuration,
                            executedAt: Date.now()
                        })
                        jasmine.clock().tick(playedDuration)
                        const testee: PartService = new PartService()

                        const result: number = testee.getDuration(part)

                        expect(result).toBe(playedDuration)
                    })
                })

                describe('part has no played duration', () => {
                    it('returns the auto-next overlap duration', () => {
                        const autoNextOverlapDuration: number = 3456
                        const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                        const part: Part = testEntityFactory.createPart({
                            isOnAir: false,
                            autoNext: { overlap: autoNextOverlapDuration },
                        })
                        const testee: PartService = new PartService()

                        const result: number = testee.getDuration(part)

                        expect(result).toBe(autoNextOverlapDuration)
                    })
                })
            })

            describe('part has manual take next', () => {
                describe('part has a played duration', () => {
                    it('returns played duration', () => {
                        const playedDuration: number = 1234
                        const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                        const part: Part = testEntityFactory.createPart({
                            isOnAir: false,
                            playedDuration,
                        })
                        jasmine.clock().tick(playedDuration)
                        const testee: PartService = new PartService()

                        const result: number = testee.getDuration(part)

                        expect(result).toBe(playedDuration)
                    })
                })

                describe('part has no played duration', () => {
                    describe('part has expected duration', () => {
                        it('returns the expected duration', () => {
                            const expectedDuration: number = 1234
                            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                            const part: Part = testEntityFactory.createPart({
                                isOnAir: false,
                                playedDuration: expectedDuration,
                            })
                            jasmine.clock().tick(expectedDuration)
                            const testee: PartService = new PartService()

                            const result: number = testee.getDuration(part)

                            expect(result).toBe(expectedDuration)
                        })
                    })

                    describe('part has no expected duration', () => {
                        it('returns the default part duration', () => {
                            const testEntityFactory: TestEntityFactory = new TestEntityFactory()
                            const part: Part = testEntityFactory.createPart({ isOnAir: false })
                            const testee: PartService = new PartService()

                            const result: number = testee.getDuration(part)

                            expect(result).toBe(testee.defaultPartDurationInMs)
                        })
                    })
                })
            })
        })
    })
})
