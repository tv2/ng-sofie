import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActionTriggersListComponent } from './action-triggers-list.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { TestEntityFactory } from 'src/app/test/factories/test-entity.factory'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'
import { KeyEventType } from 'src/app/keyboard/value-objects/key-event-type'
import { HttpFileDownloadService } from 'src/app/core/services/http/http-file-download.service'

async function configureTestBed(): Promise<ActionTriggersListComponent> {
  const mockedActionTriggerService: ActionTriggerService = mock<ActionTriggerService>()
  const mockedDialogService = mock<DialogService>()
  await TestBed.configureTestingModule({
    providers: [
      { provide: ActionTriggerService, useValue: mockedActionTriggerService },
      { provide: DialogService, useValue: instance(mockedDialogService) },
      { provide: DialogService, useValue: instance(mockedDialogService) },
      { provide: HttpFileDownloadService, useValue: instance(mock<HttpFileDownloadService>) },
    ],
    declarations: [ActionTriggersListComponent],
  }).compileComponents()

  const fixture: ComponentFixture<ActionTriggersListComponent> = TestBed.createComponent(ActionTriggersListComponent)
  const component = fixture.componentInstance
  const testEntityFactory: TestEntityFactory = new TestEntityFactory()
  component.actionTriggers = [
    { ...testEntityFactory.createActionTrigger(), actionInfo: testEntityFactory.createAction() },
    {
      ...testEntityFactory.createActionTrigger({ id: 'action-trigger-id-2', actionId: 'action-trigger-action-id-2', data: { keys: ['1', '2'], label: 'new-label', triggerOn: KeyEventType.PRESSED } }),
      actionInfo: testEntityFactory.createAction(),
    },
  ]
  return component
}

describe('ActionTriggersListComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })

  it('should action trigger toggle select and unselect', async () => {
    const component = await configureTestBed()
    const actionTriggerOneId: string = component.actionTriggers[0].id
    expect(component.isActionTriggerSelected(actionTriggerOneId)).toBe(false)
    component.setActionTriggerSelection(true, actionTriggerOneId)
    expect(component.isActionTriggerSelected(actionTriggerOneId)).toBe(true)
    component.setActionTriggerSelection(false, actionTriggerOneId)
    expect(component.isActionTriggerSelected(actionTriggerOneId)).toBe(false)
  })
})
