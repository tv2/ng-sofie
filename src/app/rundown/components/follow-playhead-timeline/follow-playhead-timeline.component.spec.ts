import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowPlayheadTimelineComponent } from './follow-playhead-timeline.component';
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { SharedModule } from '../../../shared/shared.module'

describe(FollowPlayheadTimelineComponent.name, () => {
  let component: FollowPlayheadTimelineComponent;
  let fixture: ComponentFixture<FollowPlayheadTimelineComponent>;

  beforeEach(async () => {
    const mockedPartEntityService: PartEntityService = mock<PartEntityService>()
    const mockedRundownService: RundownService = mock<RundownService>()

    await TestBed.configureTestingModule({
      declarations: [
        FollowPlayheadTimelineComponent,
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

    fixture = TestBed.createComponent(FollowPlayheadTimelineComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
