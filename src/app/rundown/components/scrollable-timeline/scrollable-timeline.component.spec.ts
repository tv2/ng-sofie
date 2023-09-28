import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollableTimelineComponent } from './follow-playhead-timeline.component';
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { MaximumPipe } from '../../../shared/pipes/maximum.pipe'
import { SharedModule } from '../../../shared/shared.module'

describe('FollowPlayheadTimelineComponent', () => {
  let component: ScrollableTimelineComponent;
  let fixture: ComponentFixture<ScrollableTimelineComponent>;

  beforeEach(async () => {
    const mockedPartEntityService: PartEntityService = mock<PartEntityService>()
    const mockedRundownService: RundownService = mock<RundownService>()

    await TestBed.configureTestingModule({
      declarations: [
        ScrollableTimelineComponent,
      ],
      imports: [
          SharedModule
      ],
      providers: [
        { provide: PartEntityService, useValue: instance(mockedPartEntityService) },
        { provide: RundownService, useValue: instance(mockedRundownService) },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollableTimelineComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
