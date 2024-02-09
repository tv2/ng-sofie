import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RundownComponent } from './rundown.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { RundownStateService } from '../../../core/services/rundown-state.service'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { DialogService } from '../../../shared/services/dialog.service'
import { RundownTimingContextStateService } from '../../../core/services/rundown-timing-context-state.service'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { Logger } from '../../../core/abstractions/logger.service'
import { RundownEventObserver } from 'src/app/core/services/rundown-event-observer.service'
import { ActionStateService } from '../../../shared/services/action-state.service'
import { EntityParser } from '../../../core/abstractions/entity-parser.service'
import { MiniShelfStateService } from '../../services/mini-shelf-state.service'

describe('RundownComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(
  params: {
    mockedRundownService?: RundownService
    mockedRundownStateService?: RundownStateService
    mockedDialogService?: DialogService
    rundownEventObserver?: RundownEventObserver
    mockedRundownTimingContextStateService?: RundownTimingContextStateService
    mockedActionStateService?: ActionStateService
    mockedEntityParser?: EntityParser
    mockedMiniShelfStateService?: MiniShelfStateService
  } = {}
): Promise<RundownComponent> {
  const mockedRundownService: RundownService = params.mockedRundownService ?? mock<RundownService>()
  const mockedRundownEventObserver: RundownEventObserver = params.rundownEventObserver ?? mock<RundownEventObserver>()
  const mockedDialogService: DialogService = params.mockedDialogService ?? mock<DialogService>()
  const mockedRundownTimingContextStateService: RundownTimingContextStateService = params.mockedRundownTimingContextStateService ?? mock<RundownTimingContextStateService>()
  const mockedActionStateService: ActionStateService = params.mockedActionStateService ?? mock<ActionStateService>()
  const mockedEntityParser: EntityParser = params.mockedEntityParser ?? mock<EntityParser>()
  const mockedMiniShelfStateService: MiniShelfStateService = params.mockedMiniShelfStateService ?? mock<MiniShelfStateService>()

  await TestBed.configureTestingModule({
    providers: [
      { provide: RundownService, useValue: instance(mockedRundownService) },
      { provide: DialogService, useValue: instance(mockedDialogService) },
      { provide: RundownEventObserver, useValue: instance(mockedRundownEventObserver) },
      { provide: PartEntityService, useValue: instance(mock<PartEntityService>()) },
      { provide: RundownTimingContextStateService, useValue: instance(mockedRundownTimingContextStateService) },
      { provide: Logger, useValue: instance(mock<Logger>()) },
      { provide: ActionStateService, useValue: instance(mockedActionStateService) },
      { provide: EntityParser, useValue: instance(mockedEntityParser) },
      { provide: MiniShelfStateService, useValue: instance(mockedMiniShelfStateService) },
    ],
    declarations: [RundownComponent],
  }).compileComponents()

  const fixture: ComponentFixture<RundownComponent> = TestBed.createComponent(RundownComponent)
  return fixture.componentInstance
}
