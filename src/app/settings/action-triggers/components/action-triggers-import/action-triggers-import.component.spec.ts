import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActionTriggersImportComponent } from './action-triggers-import.component'
import { mock } from '@typestrong/ts-mockito'
import { ActionTriggerParser } from 'src/app/shared/abstractions/action-trigger-parser.service'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'
import { NotificationService } from '../../../../shared/services/notification.service'

describe('ActionTriggersImportComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<ActionTriggersImportComponent> {
  const mockedActionTriggerService: ActionTriggerService = mock<ActionTriggerService>()
  const mockedActionTriggerParser: ActionTriggerParser = mock<ActionTriggerParser>()
  await TestBed.configureTestingModule({
    providers: [
      { provide: ActionTriggerService, useValue: mockedActionTriggerService },
      { provide: ActionTriggerParser, useValue: mockedActionTriggerParser },
      { provide: NotificationService, useValue: mock(NotificationService) },
    ],
    declarations: [ActionTriggersImportComponent],
  }).compileComponents()

  const fixture: ComponentFixture<ActionTriggersImportComponent> = TestBed.createComponent(ActionTriggersImportComponent)
  return fixture.componentInstance
}
