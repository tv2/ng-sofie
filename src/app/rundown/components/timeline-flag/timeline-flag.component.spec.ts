import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineFlagComponent } from './timeline-flag.component';

describe('TimelineFlagComponent', () => {
  let component: TimelineFlagComponent;
  let fixture: ComponentFixture<TimelineFlagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineFlagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineFlagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
