import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SegmentEndIndicatorComponent } from './segment-end-indicator.component'

describe('SegmentEndIndicatorComponent', () => {
  let component: SegmentEndIndicatorComponent
  let fixture: ComponentFixture<SegmentEndIndicatorComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SegmentEndIndicatorComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SegmentEndIndicatorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
