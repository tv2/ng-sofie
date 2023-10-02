import { TestBed } from '@angular/core/testing'

import { TimelineMarkersComponent } from './timeline-markers.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { TimestampPipePipe } from '../../../shared/pipes/timestamp.pipe'

describe('TimelineComponent', () => {
  it('should create', async () => {
    await  configureTestBed()
    const fixture = TestBed.createComponent(TimelineMarkersComponent)
    const component = fixture.componentInstance
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<void> {
  const mockedTimestampPipe: TimestampPipePipe = mock<TimestampPipePipe>()
  await TestBed.configureTestingModule({
    declarations: [ TimelineMarkersComponent ],
    providers: [
      { provide: TimestampPipePipe, useValue: instance(mockedTimestampPipe) },
    ]
  }).compileComponents()
}
