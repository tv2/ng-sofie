import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RundownOverviewComponent } from './rundown-overview.component';

describe('RundownOverviewComponent', () => {
  let component: RundownOverviewComponent;
  let fixture: ComponentFixture<RundownOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RundownOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RundownOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
