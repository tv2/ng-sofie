import { ComponentFixture, TestBed } from '@angular/core/testing'
import { KeyboardMappingPageComponent } from './keyboard-mapping-page.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { ActionTriggerStateService } from 'src/app/core/services/action-trigger-state.service'
import { TestEntityFactory } from 'src/app/test/factories/test-entity.factory'
import { TestLoggerFactory } from 'src/app/test/factories/test-logger.factory'
import { Logger } from 'src/app/core/abstractions/logger.service'
import { ActionStateService } from 'src/app/shared/services/action-state.service'
import { KeyEventType } from 'src/app/keyboard/value-objects/key-event-type'
import { FileDownloadService } from 'src/app/shared/abstractions/file-download.service'

describe('KeyboardMappingPageComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })

  it('should actionsTriggersList have 2 item', async () => {
    const component = await configureTestBed()
    expect(component.actionTriggersWithAction.length).toBe(2)
  })

  it('should selected action trigger correctly', async () => {
    const component = await configureTestBed()
    component.selectActionTriggerForEditing(component.actionTriggersWithAction[1])
    expect(component.selectedActionTrigger?.actionTrigger.id).toBe(component.actionTriggersWithAction[1].actionTrigger.id)
  })

  it('should cancel functionality remove selected trigger', async () => {
    const component = await configureTestBed()
    component.selectActionTriggerForEditing(component.actionTriggersWithAction[1])
    expect(component.selectedActionTrigger?.actionTrigger.id).toBe(component.actionTriggersWithAction[1].actionTrigger.id)
    component.cancelActionTrigger()
    expect(component.selectedActionTrigger).toBe(undefined)
  })
})

async function configureTestBed(): Promise<KeyboardMappingPageComponent> {
  const mockedActionTriggerStateService: ActionTriggerStateService = mock<ActionTriggerStateService>()
  const testLoggerFactory: TestLoggerFactory = new TestLoggerFactory()
  await TestBed.configureTestingModule({
    providers: [
      { provide: ActionTriggerStateService, useValue: mockedActionTriggerStateService },
      { provide: Logger, useValue: testLoggerFactory.createLogger() },
      { provide: ActionStateService, useValue: instance(mock<ActionStateService>()) },
      { provide: FileDownloadService, useValue: instance(mock<FileDownloadService>()) },
    ],
    declarations: [KeyboardMappingPageComponent],
  }).compileComponents()

  const fixture: ComponentFixture<KeyboardMappingPageComponent> = TestBed.createComponent(KeyboardMappingPageComponent)
  const component = fixture.componentInstance
  const testEntityFactory: TestEntityFactory = new TestEntityFactory()
  component.actionTriggersWithAction = [
    { actionTrigger: { ...testEntityFactory.createActionTrigger() }, action: testEntityFactory.createAction() },
    {
      actionTrigger: {
        ...testEntityFactory.createActionTrigger({
          id: 'action-trigger-id-2',
          actionId: 'action-trigger-action-id-2',
          data: { keys: ['1', '2'], label: 'random-label-2', triggerOn: KeyEventType.PRESSED },
        }),
      },
      action: testEntityFactory.createAction(),
    },
  ]
  return component
}
