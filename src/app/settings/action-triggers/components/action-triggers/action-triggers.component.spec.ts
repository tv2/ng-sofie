import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActionTriggersComponent } from './action-triggers.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { ActionTriggerStateService } from 'src/app/core/services/action-trigger-state.service'
import { TestEntityFactory } from 'src/app/test/factories/test-entity.factory'
import { TestLoggerFactory } from 'src/app/test/factories/test-logger.factory'
import { Logger } from 'src/app/core/abstractions/logger.service'
import { ActionStateService } from 'src/app/shared/services/action-state.service'
import { KeyEventType } from 'src/app/keyboard/value-objects/key-event-type'
import { FileDownloadService } from 'src/app/core/abstractions/file-download.service'

describe('ActionTriggersComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })

  it('should actionsTriggersList have 2 item', async () => {
    const component = await configureTestBed()
    expect(component.actionTriggers.length).toBe(2)
  })

  it('should selected action trigger correctly', async () => {
    const component = await configureTestBed()
    component.newActionTriggerOpen(component.actionTriggers[1])
    expect(component.selectedAction?.id).toBe(component.actionTriggers[1].id)
  })

  it('should cancel functionality remove selected trigger', async () => {
    const component = await configureTestBed()
    component.newActionTriggerOpen(component.actionTriggers[1])
    expect(component.selectedAction?.id).toBe(component.actionTriggers[1].id)
    component.cancelActionTrigger()
    expect(component.selectedAction).toBe(undefined)
  })
})

async function configureTestBed(): Promise<ActionTriggersComponent> {
  const mockedActionTriggerStateService: ActionTriggerStateService = mock<ActionTriggerStateService>()
  const testLoggerFactory: TestLoggerFactory = new TestLoggerFactory()
  await TestBed.configureTestingModule({
    providers: [
      { provide: ActionTriggerStateService, useValue: mockedActionTriggerStateService },
      { provide: Logger, useValue: testLoggerFactory.createLogger() },
      { provide: ActionStateService, useValue: instance(mock<ActionStateService>()) },
      { provide: FileDownloadService, useValue: instance(mock<FileDownloadService>()) },
    ],
    declarations: [ActionTriggersComponent],
  }).compileComponents()

  const fixture: ComponentFixture<ActionTriggersComponent> = TestBed.createComponent(ActionTriggersComponent)
  const component = fixture.componentInstance
  const testEntityFactory: TestEntityFactory = new TestEntityFactory()
  component.actionTriggers = [
    { ...testEntityFactory.createActionTrigger(), actionInfo: testEntityFactory.createAction() },
    {
      ...testEntityFactory.createActionTrigger({
        id: 'action-trigger-id-2',
        actionId: 'action-trigger-action-id-2',
        data: { keys: ['1', '2'], label: 'random-label-2', triggerOn: KeyEventType.PRESSED },
      }),
      actionInfo: testEntityFactory.createAction(),
    },
  ]
  return component
}
