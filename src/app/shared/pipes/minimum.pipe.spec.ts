import { MinimumPipe } from './minimum.pipe'

describe(MinimumPipe.name, () => {
  it('create an instance', () => {
    const pipe = new MinimumPipe()
    expect(pipe).toBeTruthy()
  })

  describe('transform', () => {
    it('returns the value if only a single value is given', () => {
      const testee: MinimumPipe = new MinimumPipe()
      const value: number = 42

      const result: number = testee.transform(value)

      expect(result).toBe(value)
    })
  })
})
