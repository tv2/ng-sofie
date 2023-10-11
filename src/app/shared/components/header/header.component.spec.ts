import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HeaderComponent } from './header.component'
import { Logger } from '../../../core/abstractions/logger.service'
import { instance, mock } from '@typestrong/ts-mockito'

describe('HeaderComponent', () => {
  let component: HeaderComponent
  let fixture: ComponentFixture<HeaderComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [{ provide: Logger, useValue: instance(mock<Logger>()) }],
    }).compileComponents()

    fixture = TestBed.createComponent(HeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
