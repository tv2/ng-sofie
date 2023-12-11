import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RundownComponent } from './rundown.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { RundownStateService } from '../../../core/services/rundown-state.service'
import { RundownService } from '../../../shared/abstractions/rundown.service'
import { DialogService } from '../../../shared/services/dialog.service'
import { RundownTimingContextStateService } from '../../../core/services/rundown-timing-context-state.service'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { Logger } from '../../../core/abstractions/logger.service'

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
    mockedRundownTimingContextStateService?: RundownTimingContextStateService
  } = {}
): Promise<RundownComponent> {
  const mockedRundownService: RundownService = params.mockedRundownService ?? mock<RundownService>()
  const mockedDialogService: DialogService = params.mockedDialogService ?? mock<DialogService>()
  const mockedRundownTimingContextStateService: RundownTimingContextStateService = params.mockedRundownTimingContextStateService ?? mock<RundownTimingContextStateService>()

  await TestBed.configureTestingModule({
    providers: [
      { provide: RundownService, useValue: instance(mockedRundownService) },
      { provide: DialogService, useValue: instance(mockedDialogService) },
      { provide: PartEntityService, useValue: instance(mock<PartEntityService>()) },
      { provide: RundownTimingContextStateService, useValue: instance(mockedRundownTimingContextStateService) },
      { provide: Logger, useValue: instance(mock<Logger>()) },
    ],
    declarations: [RundownComponent],
  }).compileComponents()

  const fixture: ComponentFixture<RundownComponent> = TestBed.createComponent(RundownComponent)
  return fixture.componentInstance
}
