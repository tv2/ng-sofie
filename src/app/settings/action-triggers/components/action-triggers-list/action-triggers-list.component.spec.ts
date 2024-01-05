import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActionTriggersListComponent } from './action-triggers-list.component'
import { anything, instance, mock, when } from '@typestrong/ts-mockito'
import { Observable, Subscription } from 'rxjs'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { ActionTriggerStateService } from 'src/app/core/services/action-trigger-state.service'

describe('ActionTriggersListComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<ActionTriggersListComponent> {
  const mockedActionTriggerStateService: ActionTriggerStateService = instance(createMockOfActionTriggerStateService())
  const mockedDialogService = mock<DialogService>()
  await TestBed.configureTestingModule({
    providers: [
      { provide: ActionTriggerStateService, useValue: mockedActionTriggerStateService },
      { provide: DialogService, useValue: instance(mockedDialogService) },
    ],
    declarations: [ActionTriggersListComponent],
  }).compileComponents()

  const fixture: ComponentFixture<ActionTriggersListComponent> = TestBed.createComponent(ActionTriggersListComponent)
  return fixture.componentInstance
}

function createMockOfActionTriggerStateService(): ActionTriggerStateService {
  const mockedActionTriggersService = mock<ActionTriggerStateService>()
  const mockedSubscription = mock<Subscription>()
  const mockedObservable = mock<Observable<void>>()
  when(mockedObservable.subscribe(anything)).thenReturn(instance(mockedSubscription))
  return mockedActionTriggersService
}
