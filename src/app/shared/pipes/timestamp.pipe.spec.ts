import { MillisecondsAsTimePipe } from './timestamp.pipe'

describe('TimestampPipe', () => {
    it('create an instance', () => {
        const testee: MillisecondsAsTimePipe = new MillisecondsAsTimePipe()
        expect(testee).toBeTruthy()
    })

    describe('formats duration', () => {
        it('of 0 seconds', () => {
            const testee: MillisecondsAsTimePipe = new MillisecondsAsTimePipe()
            const durationInSeconds: number = 0

            const result: string = testee.transform(durationInSeconds)

            expect(result).toBe('00:00')
        })

        it('of 59 seconds', () => {
            const testee: MillisecondsAsTimePipe = new MillisecondsAsTimePipe()
            const durationInSeconds: number = 59

            const result: string = testee.transform(durationInSeconds)

            expect(result).toBe('00:59')
        })

        it('of over 1 minute and below 1 hour', () => {
            const testee: MillisecondsAsTimePipe = new MillisecondsAsTimePipe()
            const durationInSeconds: number = 30 * 60 + 12

            const result: string = testee.transform(durationInSeconds)

            expect(result).toBe('30:12')
        })

        it('of over 1 hour and below 100 hours', () => {
            const testee: MillisecondsAsTimePipe = new MillisecondsAsTimePipe()
            const durationInSeconds: number = 99 * 60 * 60 +  30 * 60 + 12

            const result: string = testee.transform(durationInSeconds)

            expect(result).toBe('99:30:12')
        })

        it('of over 100 hours', () => {
            const testee: MillisecondsAsTimePipe = new MillisecondsAsTimePipe()
            const durationInSeconds: number = 127 * 60 * 60 +  30 * 60 + 12

            const result: string = testee.transform(durationInSeconds)

            expect(result).toBe('127:30:12')
        })
    })

})
