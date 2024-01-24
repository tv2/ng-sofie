import { ComponentFixture, TestBed } from '@angular/core/testing'

import { VirtualKeyboardComponent } from './virtual-keyboard.component'
import { KeyBindingMatcher } from '../../abstractions/key-binding-matcher.service'
import { instance, mock, when } from '@typestrong/ts-mockito'
import { Logger } from '../../../core/abstractions/logger.service'
import { TestLoggerFactory } from '../../../test/factories/test-logger.factory'
import { KeyAliasService } from '../../abstractions/key-alias-service'
import { PhysicalKeyboardLayoutService } from '../../abstractions/physical-keyboard-layout.service'
import { KeyboardKeyLabelService } from '../../abstractions/keyboard-key-label.service'

describe('VirtualKeyboardComponent', () => {
  let component: VirtualKeyboardComponent
  let fixture: ComponentFixture<VirtualKeyboardComponent>

  beforeEach(async () => {
    const testLoggerFactory: TestLoggerFactory = new TestLoggerFactory()
    const mockedKeyboardKeyLabelService: KeyboardKeyLabelService = createMockOfKeyboardKeyLabelService()
    const mockedPhysicalKeyboardLayoutService: PhysicalKeyboardLayoutService = createMockOfPhysicalKeyboardLayoutService()

    await TestBed.configureTestingModule({
      declarations: [VirtualKeyboardComponent],
      providers: [
        { provide: KeyBindingMatcher, useValue: instance(mock<KeyBindingMatcher>()) },
        { provide: KeyAliasService, useValue: instance(mock<KeyAliasService>()) },
        { provide: Logger, useValue: testLoggerFactory.createLogger() },
        { provide: PhysicalKeyboardLayoutService, useValue: instance(mockedPhysicalKeyboardLayoutService) },
        { provide: KeyboardKeyLabelService, useValue: instance(mockedKeyboardKeyLabelService) },
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

function createMockOfKeyboardKeyLabelService(): KeyboardKeyLabelService {
  const mockedKeyboardKeyLabelService: KeyboardKeyLabelService = mock<KeyboardKeyLabelService>()
  when(mockedKeyboardKeyLabelService.getLocalKeyboardKeyLabels()).thenResolve(new Map())
  return mockedKeyboardKeyLabelService
}

function createMockOfPhysicalKeyboardLayoutService(): PhysicalKeyboardLayoutService {
  const mockedPhysicalKeyboardLayoutService: PhysicalKeyboardLayoutService = mock<PhysicalKeyboardLayoutService>()
  when(mockedPhysicalKeyboardLayoutService.getPhysicalKeyboardLayout()).thenReturn({ controlKeyRows: [], functionKeyRow: [], mainKeyRows: [], name: 'empty-layout' })
  return mockedPhysicalKeyboardLayoutService
}
