import { Part, PartInterface } from './part'

const DEFAULT_PART_DURATION_IN_MS: number = 4000

describe(Part.name, () => {
    beforeEach(() => {
        jasmine.clock().install()
        jasmine.clock().mockDate()
    })
    afterEach(() => jasmine.clock().uninstall())

    describe(Part.prototype.getDuration.name, () => {
        describe('part is ON-AIR', () => {
            describe('part has auto-next', () => {
                describe('auto-next overlap duration is longer than the time since part was taken', () => {
                    it('returns the auto-next overlap duration', () => {
                        const autoNextOverlapDuration: number = 3456
                        const testee = createPart({
                            isOnAir: true,
                            autoNext: { overlap: autoNextOverlapDuration },
                            executedAt: Date.now()
                        })
                        jasmine.clock().tick(100)

                        const result: number = testee.getDuration()

                        expect(result).toBe(autoNextOverlapDuration)
                    })
                })

                describe('auto-next overlap duration is shorter than the time since part was taken', () => {
                    it('returns the time since part was taken', () => {
                        const autoNextOverlapDuration: number = 3456
                        const playedDuration: number = autoNextOverlapDuration + 2000
                        const testee = createPart({
                            isOnAir: true,
                            autoNext: { overlap: autoNextOverlapDuration },
                            executedAt: Date.now()
                        })
                        jasmine.clock().tick(playedDuration)

                        const result: number = testee.getDuration()

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
                            const testee = createPart({
                                isOnAir: true,
                                expectedDuration,
                                executedAt: Date.now()
                            })
                            jasmine.clock().tick(playedDuration)

                            const result: number = testee.getDuration()

                            expect(result).toBe(expectedDuration)
                        })
                    })

                    describe('expected duration is shorter than the time since part was taken', () => {
                        it('returns the time since part was taken', () => {
                            const expectedDuration: number = 3456
                            const playedDuration: number = 4000
                            const testee = createPart({
                                isOnAir: true,
                                expectedDuration,
                                executedAt: Date.now()
                            })
                            jasmine.clock().tick(playedDuration)

                            const result: number = testee.getDuration()

                            expect(result).toBe(playedDuration)
                        })
                    })
                })

                describe('part has no expected duration', () => {
                    describe('default part duration is longer than the time since part was taken', () => {
                        it('returns the default part duration', () => {
                            const playedDuration: number = 3000
                            const testee = createPart({
                                isOnAir: true,
                                executedAt: Date.now()
                            })
                            jasmine.clock().tick(playedDuration)

                            const result: number = testee.getDuration()

                            expect(result).toBe(DEFAULT_PART_DURATION_IN_MS)
                        })
                    })

                    describe('default part duration is shorter than the time since part was taken', () => {
                        it('returns the time since part was taken', () => {
                            const playedDuration: number = 5000
                            const testee = createPart({
                                isOnAir: true,
                                executedAt: Date.now()
                            })
                            jasmine.clock().tick(playedDuration)

                            const result: number = testee.getDuration()

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
                        const testee = createPart({
                            isOnAir: false,
                            autoNext: { overlap: autoNextOverlapDuration },
                            playedDuration,
                            executedAt: Date.now()
                        })
                        jasmine.clock().tick(playedDuration)

                        const result: number = testee.getDuration()

                        expect(result).toBe(playedDuration)
                    })
                })

                describe('part has no played duration', () => {
                    it('returns the auto-next overlap duration', () => {
                        const autoNextOverlapDuration: number = 3456
                        const testee = createPart({
                            isOnAir: false,
                            autoNext: { overlap: autoNextOverlapDuration },
                        })

                        const result: number = testee.getDuration()

                        expect(result).toBe(autoNextOverlapDuration)
                    })
                })
            })

            describe('part has manual take next', () => {
                describe('part has a played duration', () => {
                    it('returns played duration', () => {
                        const playedDuration: number = 1234
                        const testee = createPart({
                            isOnAir: false,
                            playedDuration,
                        })
                        jasmine.clock().tick(playedDuration)

                        const result: number = testee.getDuration()

                        expect(result).toBe(playedDuration)
                    })
                })

                describe('part has no played duration', () => {
                    describe('part has expected duration', () => {
                        it('returns the expected duration', () => {
                            const expectedDuration: number = 1234
                            const testee = createPart({
                                isOnAir: false,
                                playedDuration: expectedDuration,
                            })
                            jasmine.clock().tick(expectedDuration)

                            const result: number = testee.getDuration()

                            expect(result).toBe(expectedDuration)
                        })
                    })

                    describe('part has no expected duration', () => {
                        it('returns the default part duration', () => {
                            const testee = createPart({ isOnAir: false })

                            const result: number = testee.getDuration()

                            expect(result).toBe(DEFAULT_PART_DURATION_IN_MS)
                        })
                    })
                })
            })
        })
    })
})

function createPart(partInterface: Partial<PartInterface> = {}): Part {
    return new Part({
        isOnAir: false,
        executedAt: 0,
        playedDuration: 0,
        ...partInterface
    } as PartInterface)
}
