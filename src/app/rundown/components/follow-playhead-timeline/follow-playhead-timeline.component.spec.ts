import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowPlayheadTimelineComponent } from './follow-playhead-timeline.component';

describe('FollowPlayheadTimelineComponent', () => {
  let component: FollowPlayheadTimelineComponent;
  let fixture: ComponentFixture<FollowPlayheadTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowPlayheadTimelineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowPlayheadTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
