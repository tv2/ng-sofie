import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RoundedBoxComponent } from './rounded-box.component'

describe('RoundedBoxComponent', () => {
  let component: RoundedBoxComponent
  let fixture: ComponentFixture<RoundedBoxComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoundedBoxComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(RoundedBoxComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
