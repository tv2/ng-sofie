import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatMenuModule } from '@angular/material/menu'
import { ButtonComponent } from './button.component'
import { anyString, instance, mock, when } from '@typestrong/ts-mockito'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { IconService } from 'src/app/core/abstractions/icon.service'

describe('ButtonComponent', () => {
  let component: ButtonComponent
  let fixture: ComponentFixture<ButtonComponent>
  const mockedIconService: IconService = mock<IconService>()
  when(mockedIconService.getIconProperty(anyString())).thenReturn(faXmark)
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent],
      providers: [{ provide: IconService, useValue: instance(mockedIconService) }],
      imports: [MatMenuModule],
    }).compileComponents()

    fixture = TestBed.createComponent(ButtonComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
