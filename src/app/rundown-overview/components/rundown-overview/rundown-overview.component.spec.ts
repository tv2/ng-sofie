import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RundownOverviewComponent } from './rundown-overview.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { DialogService } from '../../../shared/services/dialog.service'
import { BasicRundownStateService } from '../../../core/services/basic-rundown-state.service'
import { Logger } from '../../../core/abstractions/logger.service'
import { TestLoggerFactory } from '../../../test/factories/test-logger.factory'
import { RundownTimingService } from '../../../core/services/rundown-timing.service'

describe('RundownOverviewComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(
  params: { mockedRundownService?: RundownService; mockedDialogService?: DialogService; mockedBasicRundownStateService?: BasicRundownStateService } = {}
): Promise<RundownOverviewComponent> {
  const mockedRundownService = params.mockedRundownService ?? mock<RundownService>()
  const mockedBasicRundownStateService = params.mockedBasicRundownStateService ?? mock<BasicRundownStateService>()
  const mockedDialogService = params.mockedDialogService ?? mock<DialogService>()
  await TestBed.configureTestingModule({
    providers: [
      { provide: BasicRundownStateService, useValue: instance(mockedBasicRundownStateService) },
      { provide: RundownService, useValue: instance(mockedRundownService) },
      { provide: DialogService, useValue: instance(mockedDialogService) },
      { provide: Logger, useValue: createLogger() },
      { provide: RundownTimingService, useValue: instance(mock<RundownTimingService>()) },
    ],
    declarations: [RundownOverviewComponent],
  }).compileComponents()

  const fixture: ComponentFixture<RundownOverviewComponent> = TestBed.createComponent(RundownOverviewComponent)
  return fixture.componentInstance
}

function createLogger(): Logger {
  const testLoggerFactory: TestLoggerFactory = new TestLoggerFactory()
  return testLoggerFactory.createLogger()
}
