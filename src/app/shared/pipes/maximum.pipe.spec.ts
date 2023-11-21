import { MaximumPipe } from './maximum.pipe'

describe(MaximumPipe.name, () => {
  it('create an instance', () => {
    const pipe = new MaximumPipe()
    expect(pipe).toBeTruthy()
  })
})
