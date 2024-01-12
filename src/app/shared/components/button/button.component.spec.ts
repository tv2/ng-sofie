import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatMenuModule } from '@angular/material/menu'
import { ButtonComponent } from './button.component'
import { HttpIconService } from 'src/app/core/services/http/http-icon.service'
import { anyString, instance, mock, when } from '@typestrong/ts-mockito'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

describe('ButtonComponent', () => {
  let component: ButtonComponent
  let fixture: ComponentFixture<ButtonComponent>
  const mockedHttpIconService: HttpIconService = mock<HttpIconService>()
  when(mockedHttpIconService.getIconProperty(anyString())).thenReturn(faXmark)
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent],
      providers: [{ provide: HttpIconService, useValue: instance(mockedHttpIconService) }],
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
