import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RundownHeaderComponent } from './rundown-header.component';

describe('RundownViewHeaderComponent', () => {
  let component: RundownHeaderComponent;
  let fixture: ComponentFixture<RundownHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RundownHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RundownHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
