import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RundownComponent } from './rundown.component';

describe('RundownComponent', () => {
  let component: RundownComponent;
  let fixture: ComponentFixture<RundownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RundownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RundownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
