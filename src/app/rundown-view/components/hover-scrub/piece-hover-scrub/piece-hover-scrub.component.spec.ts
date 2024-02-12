import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { PieceHoverScrubComponent } from './piece-hover-scrub.component'

describe('PieceHoverScrubComponent', () => {
  let component: PieceHoverScrubComponent
  let fixture: ComponentFixture<PieceHoverScrubComponent>

  beforeEach(async () => {
    const mockedConfigurationService: ConfigurationService = mock<ConfigurationService>()
    await TestBed.configureTestingModule({
      declarations: [PieceHoverScrubComponent],
      providers: [{ provide: ConfigurationService, useValue: instance(mockedConfigurationService) }],
    }).compileComponents()

    fixture = TestBed.createComponent(PieceHoverScrubComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
