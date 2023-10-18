import { ComponentFixture, TestBed } from '@angular/core/testing'

import { VirtualKeyboardComponent } from './virtual-keyboard.component'
import { KeyBindingMatcher } from '../../abstractions/key-binding-matcher.service'
import { instance, mock } from '@typestrong/ts-mockito'

describe('VirtualKeyboardComponent', () => {
  let component: VirtualKeyboardComponent
  let fixture: ComponentFixture<VirtualKeyboardComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VirtualKeyboardComponent],
      providers: [{ provide: KeyBindingMatcher, useValue: instance(mock<KeyBindingMatcher>()) }],
    }).compileComponents()

    fixture = TestBed.createComponent(VirtualKeyboardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
