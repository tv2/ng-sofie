import { ComponentFixture, TestBed } from '@angular/core/testing'

import { IconButtonComponent } from './icon-button.component'
import { HttpIconService } from 'src/app/core/services/http/http-icon.service'
import { anyString, instance, mock, when } from '@typestrong/ts-mockito'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

describe('IconButtonComponent', () => {
  let component: IconButtonComponent
  let fixture: ComponentFixture<IconButtonComponent>

  beforeEach(async () => {
    const mockedHttpIconService: HttpIconService = mock<HttpIconService>()
    when(mockedHttpIconService.getIconProperty(anyString())).thenReturn(faXmark)
    when(mockedHttpIconService.getIconSizeProperty(anyString())).thenReturn('lg')
    await TestBed.configureTestingModule({
      declarations: [IconButtonComponent],
      providers: [{ provide: HttpIconService, useValue: instance(mockedHttpIconService) }],
    }).compileComponents()

    fixture = TestBed.createComponent(IconButtonComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
