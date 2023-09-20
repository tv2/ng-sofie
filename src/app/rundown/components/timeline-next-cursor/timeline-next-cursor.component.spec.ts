import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineNextCursorComponent } from './timeline-next-cursor.component';

describe('TimelineNextCursorComponent', () => {
  let component: TimelineNextCursorComponent;
  let fixture: ComponentFixture<TimelineNextCursorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineNextCursorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineNextCursorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
