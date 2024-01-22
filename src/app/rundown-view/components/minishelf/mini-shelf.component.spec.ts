import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MiniShelfComponent } from './mini-shelf.component'
import { ConfigurationService } from '../../../shared/services/configuration-service'
import { instance, mock } from '@typestrong/ts-mockito'
import { ActionStateService } from '../../../shared/services/action-state.service'
import { MediaDataService } from '../../../shared/services/media-data.service'
import { TimerPipe } from '../../../shared/pipes/timer/timer.pipe'
import { ActionService } from '../../../shared/abstractions/action.service'

describe('MiniShelfComponent', () => {
  it('should create', async () => {
    const component: MiniShelfComponent = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(
  params: {
    mockedConfigurationService?: ConfigurationService
    mockedActionStateService?: ActionStateService
    mockedActionService?: ActionService
    mockedMediaDataService?: MediaDataService
  } = {}
): Promise<MiniShelfComponent> {
  const mockedConfigurationService: ConfigurationService = params.mockedConfigurationService ?? mock<ConfigurationService>()
  const mockedActionStateService: ActionStateService = params.mockedActionStateService ?? mock<ActionStateService>()
  const mockedActionService: ActionService = params.mockedActionService ?? mock<ActionService>()
  const mockedMediaDataService: MediaDataService = params.mockedMediaDataService ?? mock<MediaDataService>()

  await TestBed.configureTestingModule({
    declarations: [MiniShelfComponent, TimerPipe],
    providers: [
      { provide: ConfigurationService, useValue: instance(mockedConfigurationService) },
      { provide: ActionStateService, useValue: instance(mockedActionStateService) },
      { provide: ActionService, useValue: instance(mockedActionService) },
      { provide: MediaDataService, useValue: instance(mockedMediaDataService) },
    ],
  }).compileComponents()

  const fixture: ComponentFixture<MiniShelfComponent> = TestBed.createComponent(MiniShelfComponent)
  return fixture.componentInstance
}
