import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineNextIndicatorComponent } from './timeline-next-indicator.component';

describe('TimelineNextCursorComponent', () => {
  let component: TimelineNextIndicatorComponent;
  let fixture: ComponentFixture<TimelineNextIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineNextIndicatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineNextIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
