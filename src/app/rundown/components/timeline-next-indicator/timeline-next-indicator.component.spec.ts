import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TimelineNextIndicatorComponent } from './timeline-next-indicator.component'
import { Part } from '../../../core/models/part'

describe('TimelineNextIndicatorComponent', () => {
  let component: TimelineNextIndicatorComponent
  let fixture: ComponentFixture<TimelineNextIndicatorComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineNextIndicatorComponent ]
    })
    .compileComponents()

    fixture = TestBed.createComponent(TimelineNextIndicatorComponent)
    component = fixture.componentInstance;
    component.part = {} as Part
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
