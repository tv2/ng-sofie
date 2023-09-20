import { TestBed } from '@angular/core/testing'

import { TimelineMarkersComponent } from './timeline-markers.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { TimestampPipe } from '../../../shared/pipes/timestamp.pipe'

describe('TimelineComponent', () => {
  it('should create', async () => {
    await  configureTestBed()
    const fixture = TestBed.createComponent(TimelineMarkersComponent)
    const component = fixture.componentInstance
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<void> {
  const mockedTimestampPipe: TimestampPipe = mock<TimestampPipe>()
  await TestBed.configureTestingModule({
    declarations: [ TimelineMarkersComponent ],
    providers: [
      { provide: TimestampPipe, useValue: instance(mockedTimestampPipe) },
    ]
  }).compileComponents()
}
