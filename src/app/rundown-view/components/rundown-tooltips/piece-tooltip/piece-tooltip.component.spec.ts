import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { PieceTooltipComponent } from './piece-tooltip.component'

describe('PieceTooltipComponent', () => {
  let component: PieceTooltipComponent
  let fixture: ComponentFixture<PieceTooltipComponent>

  beforeEach(async () => {
    const mockedConfigurationService: ConfigurationService = mock<ConfigurationService>()
    await TestBed.configureTestingModule({
      declarations: [PieceTooltipComponent],
      providers: [{ provide: ConfigurationService, useValue: instance(mockedConfigurationService) }],
    }).compileComponents()

    fixture = TestBed.createComponent(PieceTooltipComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
