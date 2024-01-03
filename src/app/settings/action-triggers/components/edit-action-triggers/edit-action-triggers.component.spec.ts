import { ComponentFixture, TestBed } from '@angular/core/testing'
import { EditActionTriggersComponent } from './edit-action-triggers.component'
import { ReactiveFormsModule } from '@angular/forms'
import { anything, instance, mock, when } from '@typestrong/ts-mockito'
import { Observable, Subscription } from 'rxjs'
import { ActionTriggerStateService } from 'src/app/core/services/action-trigger-state.service'
import { Logger } from 'src/app/core/abstractions/logger.service'
import { TestLoggerFactory } from 'src/app/test/factories/test-logger.factory'
import { ActionStateService } from 'src/app/shared/services/action-state.service'

describe('EditActionTriggersComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<EditActionTriggersComponent> {
  const mockedActionTriggerStateService: ActionTriggerStateService = instance(createMockOfActionTriggersService())
  const testLoggerFactory: TestLoggerFactory = new TestLoggerFactory()
  await TestBed.configureTestingModule({
    providers: [
      { provide: ActionTriggerStateService, useValue: mockedActionTriggerStateService },
      { provide: ActionStateService, useValue: instance(mock<ActionStateService>()) },
      { provide: Logger, useValue: testLoggerFactory.createLogger() },
    ],
    declarations: [EditActionTriggersComponent],
    imports: [ReactiveFormsModule],
  }).compileComponents()

  const fixture: ComponentFixture<EditActionTriggersComponent> = TestBed.createComponent(EditActionTriggersComponent)
  return fixture.componentInstance
}

function createMockOfActionTriggersService(): ActionTriggerStateService {
  const mockedActionTriggersService = mock<ActionTriggerStateService>()
  const mockedSubscription = mock<Subscription>()
  const mockedObservable = mock<Observable<void>>()
  when(mockedObservable.subscribe(anything)).thenReturn(instance(mockedSubscription))
  return mockedActionTriggersService
}
