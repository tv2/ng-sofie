import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HoverScrubComponent } from './hover-scrub.component'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'
import { instance, mock } from '@typestrong/ts-mockito'

describe('HoverScrubComponent', () => {
  let component: HoverScrubComponent
  let fixture: ComponentFixture<HoverScrubComponent>

  beforeEach(async () => {
    const mockedConfigurationService: ConfigurationService = mock<ConfigurationService>()
    await TestBed.configureTestingModule({
      declarations: [HoverScrubComponent],
      providers: [{ provide: ConfigurationService, useValue: instance(mockedConfigurationService) }],
    }).compileComponents()

    fixture = TestBed.createComponent(HoverScrubComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
