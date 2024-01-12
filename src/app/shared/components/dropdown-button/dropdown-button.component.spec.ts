import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DropdownButtonComponent } from './dropdown-button.component'
import { MatMenuModule } from '@angular/material/menu'
import { HttpIconService } from 'src/app/core/services/http/http-icon.service'
import { anyString, instance, mock, when } from '@typestrong/ts-mockito'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

describe('DropdownButtonComponent', () => {
  let component: DropdownButtonComponent
  let fixture: ComponentFixture<DropdownButtonComponent>
  const mockedHttpIconService: HttpIconService = mock<HttpIconService>()
  when(mockedHttpIconService.getIconProperty(anyString())).thenReturn(faXmark)
  when(mockedHttpIconService.getIconSizeProperty(anyString())).thenReturn('lg')

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropdownButtonComponent],
      providers: [{ provide: HttpIconService, useValue: instance(mockedHttpIconService) }],
      imports: [MatMenuModule],
    }).compileComponents()

    fixture = TestBed.createComponent(DropdownButtonComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
