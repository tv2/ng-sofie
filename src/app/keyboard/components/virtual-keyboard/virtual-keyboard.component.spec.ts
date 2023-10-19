import { ComponentFixture, TestBed } from '@angular/core/testing'

import { VirtualKeyboardComponent } from './virtual-keyboard.component'
import { KeyBindingMatcher } from '../../abstractions/key-binding-matcher.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { Logger } from '../../../core/abstractions/logger.service'
import { TestLoggerFactory } from '../../../test/factories/test-logger.factory'

describe('VirtualKeyboardComponent', () => {
  let component: VirtualKeyboardComponent
  let fixture: ComponentFixture<VirtualKeyboardComponent>

  beforeEach(async () => {
    const testLoggerFactory: TestLoggerFactory = new TestLoggerFactory()
    await TestBed.configureTestingModule({
      declarations: [VirtualKeyboardComponent],
      providers: [
        { provide: KeyBindingMatcher, useValue: instance(mock<KeyBindingMatcher>()) },
        { provide: Logger, useValue: testLoggerFactory.createLogger() },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(VirtualKeyboardComponent)
    component = fixture.componentInstance
    component.keystrokes = []
    component.keyBindings = []
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
