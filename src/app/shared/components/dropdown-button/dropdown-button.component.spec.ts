import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DropdownButtonComponent } from './dropdown-button.component'
import { MatMenuModule } from '@angular/material/menu'
import { anyString, instance, mock, when } from '@typestrong/ts-mockito'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { IconService } from 'src/app/core/abstractions/icon.service'

describe('DropdownButtonComponent', () => {
  let component: DropdownButtonComponent
  let fixture: ComponentFixture<DropdownButtonComponent>
  const mockedIconService: IconService = mock<IconService>()
  when(mockedIconService.getIconProperty(anyString())).thenReturn(faXmark)

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropdownButtonComponent],
      providers: [{ provide: IconService, useValue: instance(mockedIconService) }],
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
