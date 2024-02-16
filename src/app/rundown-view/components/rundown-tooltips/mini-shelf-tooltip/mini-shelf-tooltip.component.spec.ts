import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { MiniShelfTooltipComponent } from './mini-shelf-tooltip.component'

describe('MiniShelfTooltipComponent', () => {
  let component: MiniShelfTooltipComponent
  let fixture: ComponentFixture<MiniShelfTooltipComponent>

  beforeEach(async () => {
    const mockedConfigurationService: ConfigurationService = mock<ConfigurationService>()
    await TestBed.configureTestingModule({
      declarations: [MiniShelfTooltipComponent],
      providers: [{ provide: ConfigurationService, useValue: instance(mockedConfigurationService) }],
    }).compileComponents()

    fixture = TestBed.createComponent(MiniShelfTooltipComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
