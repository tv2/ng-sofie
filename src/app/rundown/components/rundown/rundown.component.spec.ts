import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RundownComponent } from './rundown.component';
import { RouterModule } from '@angular/router'
import { RundownService } from '../../../core/services/rundown.service'
import { RundownEventService } from '../../../core/services/rundown-event.service'

describe('RundownComponent', () => {
  let component: RundownComponent;
  let fixture: ComponentFixture<RundownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [RundownService, RundownEventService],
      declarations: [RundownComponent],
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
