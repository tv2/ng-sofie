import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActionTriggersComponent } from './action-triggers.component'
import { anything, instance, mock, when } from '@typestrong/ts-mockito'
import { Observable, Subscription } from 'rxjs'
import { ActionTrigger, KeyboardTriggerData } from 'src/app/shared/models/action-trigger'
import { ActionTriggerStateService } from 'src/app/core/services/action-trigger-state.service'

describe('ActionTriggersComponent', () => {
  it('should create', async () => {
    const component = await configureTestBed()
    expect(component).toBeTruthy()
  })
})

async function configureTestBed(): Promise<ActionTriggersComponent> {
  const mockedActionTriggerStateService: ActionTriggerStateService = instance(createMockOfActionTriggerStateService())
  await TestBed.configureTestingModule({
    providers: [{ provide: ActionTriggerStateService, useValue: mockedActionTriggerStateService }],
    declarations: [ActionTriggersComponent],
  }).compileComponents()

  const fixture: ComponentFixture<ActionTriggersComponent> = TestBed.createComponent(ActionTriggersComponent)
  return fixture.componentInstance
}

function createMockOfActionTriggerStateService(): ActionTriggerStateService {
  const mockedActionTriggersService = mock<ActionTriggerStateService>()
  const mockedSubscription = mock<Subscription>()
  const mockedObservable = mock<Observable<ActionTrigger<KeyboardTriggerData>[]>>()
  when(mockedObservable.subscribe(anything)).thenReturn(instance(mockedSubscription))
  return mockedActionTriggersService
}
