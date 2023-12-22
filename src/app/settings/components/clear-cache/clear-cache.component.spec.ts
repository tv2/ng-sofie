import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ClearCacheComponent } from './clear-cache.component'
import { Logger } from '../../../core/abstractions/logger.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { HttpConfigurationCacheService } from '../../services/http-configuration-cache.service'

describe('ClearCacheComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<ClearCacheComponent> {
  await TestBed.configureTestingModule({
    declarations: [ClearCacheComponent],
    providers: [
      { provide: HttpConfigurationCacheService, useValue: instance(mock<HttpConfigurationCacheService>()) },
      { provide: Logger, useValue: instance(mock<Logger>()) },
    ],
  }).compileComponents()

  const fixture: ComponentFixture<ClearCacheComponent> = TestBed.createComponent(ClearCacheComponent)
  return fixture.componentInstance
}
