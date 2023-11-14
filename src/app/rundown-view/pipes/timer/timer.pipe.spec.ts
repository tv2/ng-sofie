import { TimerPipe } from './timer.pipe'

describe(TimerPipe.name, () => {
  it('create an instance', () => {
    const pipe = new TimerPipe()
    expect(pipe).toBeTruthy()
  })
})
