import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ClearCacheComponent } from './clear-cache.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { HttpClient } from '@angular/common/http'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { ConfigurationService } from '../../../shared/services/configuration.service'
import { NotificationService } from '../../../shared/services/notification.service'

describe('ClearCacheComponent', () => {
  it('should create', async () => {
    const component: ClearCacheComponent = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<ClearCacheComponent> {
  await TestBed.configureTestingModule({
    declarations: [ClearCacheComponent],
    providers: [
      { provide: DialogService, useValue: instance(mock<DialogService>) },
      { provide: HttpClient, useValue: instance(mock<HttpClient>()) },
      { provide: ConfigurationService, useValue: instance(mock<ConfigurationService>()) },
      { provide: NotificationService, useValue: instance(mock(NotificationService)) },
    ],
  }).compileComponents()
  const fixture: ComponentFixture<ClearCacheComponent> = TestBed.createComponent(ClearCacheComponent)
  return fixture.componentInstance
}
