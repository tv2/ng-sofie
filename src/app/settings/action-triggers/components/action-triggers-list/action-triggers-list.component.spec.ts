import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActionTriggersListComponent } from './action-triggers-list.component'
import { anyString, anything, instance, mock, when } from '@typestrong/ts-mockito'
import { Observable, Subscription } from 'rxjs'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { MatSnackBar } from '@angular/material/snack-bar'

describe('ActionTriggersListComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<ActionTriggersListComponent> {
  const mockedActionTriggerService: ActionTriggerService = instance(createMockOfActionTriggersService())
  const mockedDialogService = mock<DialogService>()
  const mockedMatSnackBar = mock<MatSnackBar>()
  await TestBed.configureTestingModule({
    providers: [
      { provide: ActionTriggerService, useValue: mockedActionTriggerService },
      { provide: DialogService, useValue: instance(mockedDialogService) },
      { provide: MatSnackBar, useValue: mockedMatSnackBar },
    ],
    declarations: [ActionTriggersListComponent],
  }).compileComponents()

  const fixture: ComponentFixture<ActionTriggersListComponent> = TestBed.createComponent(ActionTriggersListComponent)
  return fixture.componentInstance
}

function createMockOfActionTriggersService(): ActionTriggerService {
  const mockedActionTriggersService = mock<ActionTriggerService>()
  const mockedSubscription = mock<Subscription>()
  const mockedObservable = mock<Observable<void>>()
  when(mockedObservable.subscribe(anything)).thenReturn(instance(mockedSubscription))
  when(mockedActionTriggersService.createActionTrigger(anyString())).thenResolve()
  when(mockedActionTriggersService.deleteActionTrigger(anyString())).thenResolve()
  return mockedActionTriggersService
}
