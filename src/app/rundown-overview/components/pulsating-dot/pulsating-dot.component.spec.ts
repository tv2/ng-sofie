import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PulsatingDotComponent } from './pulsating-dot.component';

describe('ActiveSignalComponent', () => {
  let component: PulsatingDotComponent;
  let fixture: ComponentFixture<PulsatingDotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PulsatingDotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PulsatingDotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
