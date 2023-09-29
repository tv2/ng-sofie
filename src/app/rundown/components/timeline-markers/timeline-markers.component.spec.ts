import { TestBed } from '@angular/core/testing'

import { TimelineMarkersComponent } from './timeline-markers.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { MillisecondsAsTimePipe } from '../../../shared/pipes/millisecondsAsTime.pipe'

describe('TimelineComponent', () => {
  it('should create', async () => {
    await  configureTestBed()
    const fixture = TestBed.createComponent(TimelineMarkersComponent)
    const component = fixture.componentInstance
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<void> {
  const mockedTimestampPipe: MillisecondsAsTimePipe = mock<MillisecondsAsTimePipe>()
  await TestBed.configureTestingModule({
    declarations: [ TimelineMarkersComponent ],
    providers: [
      { provide: MillisecondsAsTimePipe, useValue: instance(mockedTimestampPipe) },
    ]
  }).compileComponents()
}
