import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { MiniShelfHoverScrubComponent } from './mini-shelf-hover-scrub.component'

describe('MiniShelfHoverScrubComponent', () => {
  let component: MiniShelfHoverScrubComponent
  let fixture: ComponentFixture<MiniShelfHoverScrubComponent>

  beforeEach(async () => {
    const mockedConfigurationService: ConfigurationService = mock<ConfigurationService>()
    await TestBed.configureTestingModule({
      declarations: [MiniShelfHoverScrubComponent],
      providers: [{ provide: ConfigurationService, useValue: instance(mockedConfigurationService) }],
    }).compileComponents()

    fixture = TestBed.createComponent(MiniShelfHoverScrubComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
