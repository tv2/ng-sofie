import { TimestampPipe } from './timestamp.pipe'

describe('TimestampPipe', () => {
  it('create an instance', () => {
    const testee: TimestampPipe = new TimestampPipe()
    expect(testee).toBeTruthy()
  })

  describe('formats duration', () => {
    it('of 0 seconds', () => {
      const testee: TimestampPipe = new TimestampPipe()
      const durationInMs: number = 0

      const result: string = testee.transform(durationInMs)

      expect(result).toBe('00:00')
    })

    it('of 59 seconds', () => {
      const testee: TimestampPipe = new TimestampPipe()
      const durationInMs: number = 59_000

      const result: string = testee.transform(durationInMs)

      expect(result).toBe('00:59')
    })

    it('of over 1 minute and below 1 hour', () => {
      const testee: TimestampPipe = new TimestampPipe()
      const durationInMs: number = 30_000 * 60 + 12_000

      const result: string = testee.transform(durationInMs)

      expect(result).toBe('30:12')
    })

    it('of over 1 hour and below 100 hours', () => {
      const testee: TimestampPipe = new TimestampPipe()
      const durationInMs: number = 99_000 * 60 * 60 + 30_000 * 60 + 12_000

      const result: string = testee.transform(durationInMs)

      expect(result).toBe('99:30:12')
    })

    it('of over 100 hours', () => {
      const testee: TimestampPipe = new TimestampPipe()
      const durationInMs: number = 127_000 * 60 * 60 + 30_000 * 60 + 12_000

      const result: string = testee.transform(durationInMs)

      expect(result).toBe('127:30:12')
    })
  })
})
