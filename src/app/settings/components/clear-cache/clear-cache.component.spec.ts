import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ClearCacheComponent } from './clear-cache.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { HttpConfigurationCacheService } from '../../services/http-configuration-cache.service'
import { HttpClient } from '@angular/common/http'

describe('ClearCacheComponent', () => {
  it('should create', async () => {
    const component: ClearCacheComponent = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<ClearCacheComponent> {
  const mockHttpClient: HttpClient = mock<HttpClient>()
  const mockHttpConfigurationCacheService: HttpConfigurationCacheService = mock<HttpConfigurationCacheService>()
  await TestBed.configureTestingModule({
    declarations: [ClearCacheComponent],
    providers: [
      { provide: HttpClient, useValue: instance(mockHttpClient) },
      { provide: HttpConfigurationCacheService, useValue: instance(mockHttpConfigurationCacheService) },
    ],
  }).compileComponents()
  const fixture: ComponentFixture<ClearCacheComponent> = TestBed.createComponent(ClearCacheComponent)
  return fixture.componentInstance
}
