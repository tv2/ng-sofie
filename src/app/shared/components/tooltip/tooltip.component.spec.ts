import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { of } from 'rxjs'
import { TooltipComponent } from './tooltip.component'

describe('TooltipComponent', () => {
  let component: TooltipComponent
  let fixture: ComponentFixture<TooltipComponent>

  beforeEach(async () => {
    const mockedConfigurationService: ConfigurationService = mock<ConfigurationService>()
    await TestBed.configureTestingModule({
      declarations: [TooltipComponent],
      providers: [{ provide: ConfigurationService, useValue: instance(mockedConfigurationService) }],
    }).compileComponents()

    fixture = TestBed.createComponent(TooltipComponent)
    component = fixture.componentInstance
    component.tooltipElementHoverMouseEventObservable = of(undefined)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
