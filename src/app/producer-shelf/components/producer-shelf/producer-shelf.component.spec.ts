import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ProducerShelfComponent } from './producer-shelf.component'
import { KeyboardBindingService } from '../../abstractions/keyboard-binding.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { KeyboardBindingMatcher } from '../../services/keyboard-binding.matcher'

describe(ProducerShelfComponent.name, () => {
  let component: ProducerShelfComponent
  let fixture: ComponentFixture<ProducerShelfComponent>

  beforeEach(async () => {
    const mockKeyboardBindingService: KeyboardBindingService = mock<KeyboardBindingService>()
    const mockKeyboardBindingMatcher: KeyboardBindingMatcher = mock<KeyboardBindingMatcher>()

    await TestBed.configureTestingModule({
      declarations: [ProducerShelfComponent],
      providers: [
        {
          provide: KeyboardBindingService,
          useValue: instance(mockKeyboardBindingService),
        },
        {
          provide: KeyboardBindingMatcher,
          useValue: instance(mockKeyboardBindingMatcher),
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ProducerShelfComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
