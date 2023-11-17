import { TimerPipe } from './timer.pipe'

describe(TimerPipe.name, () => {
  describe(TimerPipe.prototype.transform.name, () => {
    describe('when sign is "#"', () => {
      const format: string = '#'
      describe('when duration is negative', () => {
        it('returns - sign', () => {
          const durationInMs: number = -100
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('-')
        })
      })

      describe('when duration is zero', () => {
        it('returns no sign', () => {
          const durationInMs: number = 0
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('+')
        })
      })

      describe('when duration is positive', () => {
        it('returns + sign', () => {
          const durationInMs: number = 100
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('+')
        })
      })
    })

    describe('when sign is "#+"', () => {
      const format: string = '#+'
      describe('when duration is negative', () => {
        it('returns - sign', () => {
          const durationInMs: number = -100
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('')
        })
      })

      describe('when duration is zero', () => {
        it('returns no sign', () => {
          const durationInMs: number = 0
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('+')
        })
      })

      describe('when duration is positive', () => {
        it('returns + sign', () => {
          const durationInMs: number = 100
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('+')
        })
      })
    })

    describe('when sign is "#-"', () => {
      const format: string = '#-'
      describe('when duration is negative', () => {
        it('returns - sign', () => {
          const durationInMs: number = -100
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('-')
        })
      })

      describe('when duration is zero', () => {
        it('returns no sign', () => {
          const durationInMs: number = 0
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('')
        })
      })

      describe('when duration is positive', () => {
        it('returns + sign', () => {
          const durationInMs: number = 100
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('')
        })
      })
    })

    describe('when format is "HH"', () => {
      const format: string = 'HH'

      describe('when duration is one second', () => {
        it('returns 00', () => {
          const durationInMs: number = 1000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('00')
        })
      })

      describe('when duration is one hour and one minute', () => {
        it('returns 01', () => {
          const durationInMs: number = 3_660_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('01')
        })
      })

      describe('when duration is 100 hours and 1 minute', () => {
        it('returns 100', () => {
          const durationInMs: number = 360_060_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('100')
        })
      })

      describe('when duration is negative one second', () => {
        it('returns 00', () => {
          const durationInMs: number = -1000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('00')
        })
      })

      describe('when duration is negative one hour and one minute', () => {
        it('returns 01', () => {
          const durationInMs: number = -3_660_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('01')
        })
      })

      describe('when duration is negative 100 hours and 1 minute', () => {
        it('returns 100', () => {
          const durationInMs: number = -360_060_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('100')
        })
      })
    })

    describe('when format is "HH?:"', () => {
      const format: string = 'HH?:'

      describe('when duration is one second', () => {
        it('returns an empty string', () => {
          const durationInMs: number = 1000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('')
        })
      })

      describe('when duration is one hour and one minute', () => {
        it('returns 01:', () => {
          const durationInMs: number = 3_660_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('01:')
        })
      })

      describe('when duration is 100 hours and 1 minute', () => {
        it('returns 100:', () => {
          const durationInMs: number = 360_060_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('100:')
        })
      })

      describe('when duration is negative one second', () => {
        it('returns an empty string', () => {
          const durationInMs: number = -1000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('')
        })
      })

      describe('when duration is negative one hour and one minute', () => {
        it('returns 01:', () => {
          const durationInMs: number = -3_660_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('01:')
        })
      })

      describe('when duration is negative 100 hours and 1 minute', () => {
        it('returns 100:', () => {
          const durationInMs: number = -360_060_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('100:')
        })
      })
    })

    describe('when format is "H"', () => {
      const format: string = 'H'

      describe('when duration is one second', () => {
        it('returns 0', () => {
          const durationInMs: number = 1000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('0')
        })
      })

      describe('when duration is one hour and one minute', () => {
        it('returns 1', () => {
          const durationInMs: number = 3_660_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('1')
        })
      })

      describe('when duration is 100 hours and 1 minute', () => {
        it('returns 100', () => {
          const durationInMs: number = 360_060_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('100')
        })
      })

      describe('when duration is negative one second', () => {
        it('returns 0', () => {
          const durationInMs: number = -1000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('0')
        })
      })

      describe('when duration is negative one hour and one minute', () => {
        it('returns 1', () => {
          const durationInMs: number = -3_660_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('1')
        })
      })

      describe('when duration is negative 100 hours and 1 minute', () => {
        it('returns 100', () => {
          const durationInMs: number = -360_060_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('100')
        })
      })
    })

    describe('when format is "H?:"', () => {
      const format: string = 'H?:'

      describe('when duration is one second', () => {
        it('returns an empty string', () => {
          const durationInMs: number = 1000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('')
        })
      })

      describe('when duration is one hour and one minute', () => {
        it('returns 1:', () => {
          const durationInMs: number = 3_660_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('1:')
        })
      })

      describe('when duration is 100 hours and 1 minute', () => {
        it('returns 100:', () => {
          const durationInMs: number = 360_060_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('100:')
        })
      })

      describe('when duration is negative one second', () => {
        it('returns an empty string', () => {
          const durationInMs: number = -1000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('')
        })
      })

      describe('when duration is negative one hour and one minute', () => {
        it('returns 1:', () => {
          const durationInMs: number = -3_660_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('1:')
        })
      })

      describe('when duration is negative 100 hours and 1 minute', () => {
        it('returns 100:', () => {
          const durationInMs: number = -360_060_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('100:')
        })
      })
    })

    describe('when format is "mm"', () => {
      const format: string = 'mm'

      describe('when duration is one second', () => {
        it('returns 00', () => {
          const durationInMs: number = 1000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('00')
        })
      })

      describe('when duration is negative one second', () => {
        it('returns 00', () => {
          const durationInMs: number = -1000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('00')
        })
      })

      describe('when duration is one minute', () => {
        it('returns 01', () => {
          const durationInMs: number = 60_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('01')
        })
      })

      describe('when duration is negative one minute', () => {
        it('returns 01', () => {
          const durationInMs: number = -60_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('01')
        })
      })

      describe('when duration is negative one minute', () => {
        it('returns 01', () => {
          const durationInMs: number = -60_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('01')
        })
      })

      describe('when duration is one minute and one second', () => {
        it('returns 01', () => {
          const durationInMs: number = 61_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('01')
        })
      })

      describe('when duration is negative one minute and one second', () => {
        it('returns 01', () => {
          const durationInMs: number = -61_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('01')
        })
      })

      describe('when duration is one hour and two minutes and one second', () => {
        it('returns 02', () => {
          const durationInMs: number = 3_721_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('02')
        })
      })

      describe('when duration is negative one hour and two minutes and one second', () => {
        it('returns 02', () => {
          const durationInMs: number = -3_721_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('02')
        })
      })
    })

    describe('when format is "m"', () => {
      const format: string = 'm'

      describe('when duration is one second', () => {
        it('returns 0', () => {
          const durationInMs: number = 1000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('0')
        })
      })

      describe('when duration is negative one second', () => {
        it('returns 0', () => {
          const durationInMs: number = -1000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('0')
        })
      })

      describe('when duration is one minute and one second', () => {
        it('returns 1', () => {
          const durationInMs: number = 61_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('1')
        })
      })

      describe('when duration is negative one minute and one second', () => {
        it('returns 1', () => {
          const durationInMs: number = -61_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('1')
        })
      })

      describe('when duration is one hour and two minutes and one second', () => {
        it('returns 2', () => {
          const durationInMs: number = 3_721_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('2')
        })
      })

      describe('when duration is negative one hour and two minutes and one second', () => {
        it('returns 2', () => {
          const durationInMs: number = -3_721_000
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('2')
        })
      })
    })

    describe('when format is "ss"', () => {
      const format: string = 'ss'

      describe('when duration is 500ms', () => {
        it('returns 00', () => {
          const durationInMs: number = 500
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('00')
        })
      })

      describe('when duration is negative 500ms', () => {
        it('returns 01', () => {
          const durationInMs: number = -500
          const testee: TimerPipe = createTestee()

          const result: string = testee.transform(durationInMs, format)

          expect(result).toBe('01')
        })
      })
    })
  })
})

function createTestee(): TimerPipe {
  return new TimerPipe()
}
