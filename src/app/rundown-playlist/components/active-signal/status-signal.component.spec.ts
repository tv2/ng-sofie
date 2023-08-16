import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusSignalComponent } from './status-signal.component';

describe('ActiveSignalComponent', () => {
  let component: StatusSignalComponent;
  let fixture: ComponentFixture<StatusSignalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusSignalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusSignalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
