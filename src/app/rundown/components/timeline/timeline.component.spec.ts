import { TestBed } from '@angular/core/testing'

import { TimelineComponent } from './timeline.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { TimestampPipe } from '../../../shared/pipes/timestamp.pipe'

describe('TimelineComponent', () => {
  it('should create', async () => {
    await  configureTestBed()
    const fixture = TestBed.createComponent(TimelineComponent)
    const component = fixture.componentInstance
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<void> {
  const mockedTimestampPipe: TimestampPipe = mock<TimestampPipe>()
  await TestBed.configureTestingModule({
    declarations: [ TimelineComponent ],
    providers: [
      { provide: TimestampPipe, useValue: instance(mockedTimestampPipe) },
    ]
  }).compileComponents()
}
