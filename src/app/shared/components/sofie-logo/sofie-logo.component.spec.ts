import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SofieLogoComponent } from './sofie-logo.component'

describe('SofieLogoComponent', () => {
  let component: SofieLogoComponent
  let fixture: ComponentFixture<SofieLogoComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SofieLogoComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SofieLogoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
