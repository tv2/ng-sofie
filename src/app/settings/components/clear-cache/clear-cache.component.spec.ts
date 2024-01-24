import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ClearCacheComponent } from './clear-cache.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { HttpClient } from '@angular/common/http'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { ConfigurationCacheService } from '../../services/configuration-cache.service'

describe('ClearCacheComponent', () => {
  it('should create', async () => {
    const component: ClearCacheComponent = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<ClearCacheComponent> {
  const mockHttpClient: HttpClient = mock<HttpClient>()
  const mockConfigurationCacheService: ConfigurationCacheService = mock<ConfigurationCacheService>()
  await TestBed.configureTestingModule({
    declarations: [ClearCacheComponent],
    providers: [
      { provide: DialogService, useValue: instance(mock<DialogService>) },
      { provide: HttpClient, useValue: instance(mockHttpClient) },
      { provide: ConfigurationCacheService, useValue: instance(mockConfigurationCacheService) },
    ],
  }).compileComponents()
  const fixture: ComponentFixture<ClearCacheComponent> = TestBed.createComponent(ClearCacheComponent)
  return fixture.componentInstance
}
