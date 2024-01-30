import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MiniShelfComponent } from './mini-shelf.component'
import { ConfigurationService } from '../../../shared/services/configuration-service'
import { instance, mock } from '@typestrong/ts-mockito'
import { ActionStateService } from '../../../shared/services/action-state.service'
import { TimerPipe } from '../../../shared/pipes/timer/timer.pipe'
import { MediaStateService } from '../../../shared/services/media-state.service'
import { ActionService } from '../../../shared/abstractions/action.service'
import { Logger } from '../../../core/abstractions/logger.service'

describe('MiniShelfComponent', () => {
  it('should create', async () => {
    const component: MiniShelfComponent = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(
  params: {
    mockedMediaStateService?: MediaStateService
    mockedConfigurationService?: ConfigurationService
    mockedActionStateService?: ActionStateService
    mockedActionService?: ActionService
  } = {}
): Promise<MiniShelfComponent> {
  const mockedConfigurationService: ConfigurationService = params.mockedConfigurationService ?? mock<ConfigurationService>()
  const mockedActionStateService: ActionStateService = params.mockedActionStateService ?? mock<ActionStateService>()
  const mockedMediaStateService: MediaStateService = params.mockedMediaStateService ?? mock<MediaStateService>()
  const mockedActionService: ActionService = params.mockedActionService ?? mock<ActionService>()
  const mockedLogger: Logger = mock<Logger>()

  await TestBed.configureTestingModule({
    declarations: [MiniShelfComponent, TimerPipe],
    providers: [
      { provide: ConfigurationService, useValue: instance(mockedConfigurationService) },
      { provide: ActionStateService, useValue: instance(mockedActionStateService) },
      { provide: MediaStateService, useValue: instance(mockedMediaStateService) },
      { provide: ActionService, useValue: instance(mockedActionService) },
      { provide: Logger, useValue: instance(mockedLogger) },
    ],
  }).compileComponents()

  const fixture: ComponentFixture<MiniShelfComponent> = TestBed.createComponent(MiniShelfComponent)
  return fixture.componentInstance
}
