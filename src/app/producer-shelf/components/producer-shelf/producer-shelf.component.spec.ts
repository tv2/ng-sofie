import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ProducerShelfComponent } from './producer-shelf.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { KeyBindingMatcher } from '../../../keyboard/abstractions/key-binding-matcher.service'

describe(ProducerShelfComponent.name, () => {
  let component: ProducerShelfComponent
  let fixture: ComponentFixture<ProducerShelfComponent>

  beforeEach(async () => {
    const mockKeyboardBindingMatcher: KeyBindingMatcher = mock<KeyBindingMatcher>()

    await TestBed.configureTestingModule({
      declarations: [ProducerShelfComponent],
      providers: [
        {
          provide: KeyBindingMatcher,
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
