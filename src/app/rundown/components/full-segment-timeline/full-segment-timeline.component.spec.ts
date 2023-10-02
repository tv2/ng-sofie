import { TestBed } from '@angular/core/testing'

import { FullSegmentTimelineComponent } from './full-segment-timeline.component'
import { PartComponent } from '../part/part.component'
import { TimelineMarkersComponent } from '../timeline-markers/timeline-markers.component'
import { TimelinePlayheadComponent } from '../timeline-playhead/timeline-playhead.component'
import { SharedModule } from '../../../shared/shared.module'

describe('FullSegmentTimelineComponent', () => {
  it('should create', async () => {
    await configureTestBed()
    const fixture = TestBed.createComponent(FullSegmentTimelineComponent)
    const component = fixture.componentInstance
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<void> {
  await TestBed.configureTestingModule({
    declarations: [
      FullSegmentTimelineComponent,
      PartComponent,
      TimelineMarkersComponent,
      TimelinePlayheadComponent,
    ],
    imports: [
      SharedModule
    ]
  })
    .compileComponents()
}
