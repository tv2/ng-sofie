import { TestBed } from '@angular/core/testing'

import { TimelineMarkersComponent } from './timeline-markers.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { TimerPipe } from '../../../shared/pipes/timer/timer.pipe'

describe('TimelineComponent', () => {
  it('should create', async () => {
    await configureTestBed()
    const fixture = TestBed.createComponent(TimelineMarkersComponent)
    const component = fixture.componentInstance
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<void> {
  const mockedTimerPipe: TimerPipe = mock<TimerPipe>()
  await TestBed.configureTestingModule({
    declarations: [TimelineMarkersComponent],
    providers: [{ provide: TimerPipe, useValue: instance(mockedTimerPipe) }],
  }).compileComponents()
}
