import { ComponentFixture, TestBed } from '@angular/core/testing'
import { EditActionTriggersComponent } from './edit-action-triggers.component'
import { ReactiveFormsModule } from '@angular/forms'
import { anyString, anything, instance, mock, when } from '@typestrong/ts-mockito'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'
import { Observable, Subscription } from 'rxjs'
import { ActionService } from 'src/app/shared/abstractions/action.service'

describe('EditActionTriggersComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<EditActionTriggersComponent> {
  const mockedMatSnackBar = mock<MatSnackBar>()
  const mockedActionTriggerService: ActionTriggerService = instance(createMockOfActionTriggersService())
  await TestBed.configureTestingModule({
    providers: [
      { provide: MatSnackBar, useValue: mockedMatSnackBar },
      { provide: ActionTriggerService, useValue: mockedActionTriggerService },
      { provide: ActionService, useValue: instance(mock<ActionService>()) },
    ],
    declarations: [EditActionTriggersComponent],
    imports: [ReactiveFormsModule],
  }).compileComponents()

  const fixture: ComponentFixture<EditActionTriggersComponent> = TestBed.createComponent(EditActionTriggersComponent)
  return fixture.componentInstance
}

function createMockOfActionTriggersService(): ActionTriggerService {
  const mockedActionTriggersService = mock<ActionTriggerService>()
  const mockedSubscription = mock<Subscription>()
  const mockedObservable = mock<Observable<void>>()
  when(mockedObservable.subscribe(anything)).thenReturn(instance(mockedSubscription))
  when(mockedActionTriggersService.createActionTrigger(anyString())).thenResolve()
  when(mockedActionTriggersService.updateActionTrigger(anyString())).thenResolve()
  return mockedActionTriggersService
}
