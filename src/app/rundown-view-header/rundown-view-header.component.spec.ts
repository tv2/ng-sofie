import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RundownViewHeaderComponent } from './rundown-view-header.component';

describe('RundownViewHeaderComponent', () => {
  let component: RundownViewHeaderComponent;
  let fixture: ComponentFixture<RundownViewHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RundownViewHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RundownViewHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
