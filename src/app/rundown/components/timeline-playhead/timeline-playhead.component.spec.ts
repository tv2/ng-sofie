import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelinePlayheadComponent } from './timeline-playhead.component';

describe('TimelinePlayheadComponent', () => {
  let component: TimelinePlayheadComponent;
  let fixture: ComponentFixture<TimelinePlayheadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelinePlayheadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelinePlayheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
