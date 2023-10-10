import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RundownViewComponent } from './rundown-view.component';

describe('RundownViewComponent', () => {
  let component: RundownViewComponent;
  let fixture: ComponentFixture<RundownViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RundownViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RundownViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
