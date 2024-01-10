import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActionTriggersComponent } from './action-triggers.component'
import { instance, mock } from '@typestrong/ts-mockito'
import { ActionTriggerSortKeys } from 'src/app/shared/models/action-trigger'
import { ActionTriggerStateService } from 'src/app/core/services/action-trigger-state.service'
import { TestEntityFactory } from 'src/app/test/factories/test-entity.factory'
import { TestLoggerFactory } from 'src/app/test/factories/test-logger.factory'
import { Logger } from 'src/app/core/abstractions/logger.service'
import { ActionStateService } from 'src/app/shared/services/action-state.service'

describe('ActionTriggersComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })

  it('should actionsTriggersList have 2 item', async () => {
    const component = await configureTestBed()
    expect(component.actionsTriggersList.length).toBe(2)
  })

  it('should selected action trigger correctly', async () => {
    const component = await configureTestBed()
    component.actionTriggerSelect(component.actionsTriggersList[1])
    expect(component.selectedAction?.id).toBe(component.actionsTriggersList[1].id)
  })

  it('should cancel functionality remove selected trigger', async () => {
    const component = await configureTestBed()
    component.actionTriggerSelect(component.actionsTriggersList[1])
    expect(component.selectedAction?.id).toBe(component.actionsTriggersList[1].id)
    component.cancelActionTrigger()
    expect(component.selectedAction).toBe(null)
  })

  it('should sort reorder actionsTriggersList by actionId', async () => {
    const component = await configureTestBed()
    component.actionTriggerSelect(component.actionsTriggersList[1])
    expect(component.selectedAction?.id).toBe(component.actionsTriggersList[1].id)
    component.newSortSelect(ActionTriggerSortKeys.ACTION_ID_Z_A)
    expect(component.selectedAction?.id).toBe(component.actionsTriggersList[0].id)
    component.newSortSelect(ActionTriggerSortKeys.ACTION_ID_A_Z)
    expect(component.selectedAction?.id).toBe(component.actionsTriggersList[1].id)
  })

  it('should sort reorder actionsTriggersList by keys', async () => {
    const component = await configureTestBed()
    component.actionTriggerSelect(component.actionsTriggersList[1])
    expect(component.selectedAction?.id).toBe(component.actionsTriggersList[1].id)
    component.newSortSelect(ActionTriggerSortKeys.SHORTCUT_A_Z)
    expect(component.selectedAction?.id).toBe(component.actionsTriggersList[0].id)
    component.newSortSelect(ActionTriggerSortKeys.SHORTCUT_Z_A)
    expect(component.selectedAction?.id).toBe(component.actionsTriggersList[1].id)
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
    ],
    declarations: [ActionTriggersComponent],
  }).compileComponents()

  const fixture: ComponentFixture<ActionTriggersComponent> = TestBed.createComponent(ActionTriggersComponent)
  const component = fixture.componentInstance
  const testEntityFactory: TestEntityFactory = new TestEntityFactory()
  component.actionsTriggersList = [
    { ...testEntityFactory.createActionTrigger(), actionInfo: testEntityFactory.createAction() },
    {
      ...testEntityFactory.createActionTrigger({ id: 'action-trigger-id-2', actionId: 'action-trigger-action-id-2', data: { keys: ['1', '2'], label: 'random-label-2' } }),
      actionInfo: testEntityFactory.createAction(),
    },
  ]
  return component
}
