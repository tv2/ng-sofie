import { ComponentFixture, TestBed } from '@angular/core/testing'

import { IconButtonComponent } from './icon-button.component'
import { anyString, instance, mock, when } from '@typestrong/ts-mockito'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { IconService } from 'src/app/core/abstractions/icon.service'

describe('IconButtonComponent', () => {
  let component: IconButtonComponent
  let fixture: ComponentFixture<IconButtonComponent>

  beforeEach(async () => {
    const mockedIconService: IconService = mock<IconService>()
    when(mockedIconService.getIconProperty(anyString())).thenReturn(faXmark)
    await TestBed.configureTestingModule({
      declarations: [IconButtonComponent],
      providers: [{ provide: IconService, useValue: instance(mockedIconService) }],
    }).compileComponents()

    fixture = TestBed.createComponent(IconButtonComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
