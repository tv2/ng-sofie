import { ComponentFixture, TestBed } from '@angular/core/testing'
import { EditActionTriggersComponent } from './edit-action-triggers.component'
import { ReactiveFormsModule } from '@angular/forms'
import { instance, mock } from '@typestrong/ts-mockito'
import { Logger } from 'src/app/core/abstractions/logger.service'
import { TestLoggerFactory } from 'src/app/test/factories/test-logger.factory'
import { ActionStateService } from 'src/app/shared/services/action-state.service'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'

describe('EditActionTriggersComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<EditActionTriggersComponent> {
  const mockedActionTriggerService: ActionTriggerService = mock<ActionTriggerService>()
  const testLoggerFactory: TestLoggerFactory = new TestLoggerFactory()
  await TestBed.configureTestingModule({
    providers: [
      { provide: ActionTriggerService, useValue: mockedActionTriggerService },
      { provide: ActionStateService, useValue: instance(mock<ActionStateService>()) },
      { provide: Logger, useValue: testLoggerFactory.createLogger() },
    ],
    declarations: [EditActionTriggersComponent],
    imports: [ReactiveFormsModule],
  }).compileComponents()

  const fixture: ComponentFixture<EditActionTriggersComponent> = TestBed.createComponent(EditActionTriggersComponent)
  return fixture.componentInstance
}
