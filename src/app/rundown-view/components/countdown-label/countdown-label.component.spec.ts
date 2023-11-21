import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountdownLabelComponent } from './countdown-label.component';
import { TimerPipe } from '../../../shared/pipes/timer/timer.pipe'

describe(CountdownLabelComponent.name, () => {
  let component: CountdownLabelComponent;
  let fixture: ComponentFixture<CountdownLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CountdownLabelComponent, TimerPipe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountdownLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
