import { ComponentFixture, TestBed } from '@angular/core/testing'

import { VirtualKeyboardKeyComponent } from './virtual-keyboard-key.component'

describe('VirtualKeyboardKeyComponent', () => {
  let component: VirtualKeyboardKeyComponent
  let fixture: ComponentFixture<VirtualKeyboardKeyComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VirtualKeyboardKeyComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(VirtualKeyboardKeyComponent)
    component = fixture.componentInstance
    component.keyLabel = 'KeyA'
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
