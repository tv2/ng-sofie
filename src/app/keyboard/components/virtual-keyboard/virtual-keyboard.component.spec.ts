import { ComponentFixture, TestBed } from '@angular/core/testing'

import { VirtualKeyboardComponent } from './virtual-keyboard.component'
import { KeyBindingMatcher } from '../../abstractions/key-binding-matcher.service'
import { instance, mock, when } from '@typestrong/ts-mockito'
import { Logger } from '../../../core/abstractions/logger.service'
import { TestLoggerFactory } from '../../../test/factories/test-logger.factory'
import { PhysicalKeyboardLayoutService } from '../../services/physical-keyboard-layout.service'
import { KeyAliasService } from '../../abstractions/key-alias-service'
import { DefaultKeyboardLayoutMapService } from '../../services/default-keyboard-layout-map.service'

describe('VirtualKeyboardComponent', () => {
  let component: VirtualKeyboardComponent
  let fixture: ComponentFixture<VirtualKeyboardComponent>

  beforeEach(async () => {
    const testLoggerFactory: TestLoggerFactory = new TestLoggerFactory()
    const mockedDefaultKeyboardLayoutMapService: DefaultKeyboardLayoutMapService = mock<DefaultKeyboardLayoutMapService>()
    when(mockedDefaultKeyboardLayoutMapService.createDefaultKeyboardLayoutMap()).thenReturn(new Map())
    await TestBed.configureTestingModule({
      declarations: [VirtualKeyboardComponent],
      providers: [
        { provide: KeyBindingMatcher, useValue: instance(mock<KeyBindingMatcher>()) },
        { provide: KeyAliasService, useValue: instance(mock<KeyAliasService>()) },
        { provide: Logger, useValue: testLoggerFactory.createLogger() },
        { provide: PhysicalKeyboardLayoutService, useValue: instance(mock<PhysicalKeyboardLayoutService>()) },
        { provide: DefaultKeyboardLayoutMapService, useValue: instance(mockedDefaultKeyboardLayoutMapService) },
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
