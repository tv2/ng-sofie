import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActionTriggersComponent } from './action-triggers.component'
import { anyString, anything, instance, mock, when } from '@typestrong/ts-mockito'
import { Observable, Subscription } from 'rxjs'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'

describe('ActionTriggersComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<ActionTriggersComponent> {
  const mockedActionTriggerService: ActionTriggerService = instance(createMockOfActionTriggersService())
  await TestBed.configureTestingModule({
    providers: [{ provide: ActionTriggerService, useValue: mockedActionTriggerService }],
    declarations: [ActionTriggersComponent],
  }).compileComponents()

  const fixture: ComponentFixture<ActionTriggersComponent> = TestBed.createComponent(ActionTriggersComponent)
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
