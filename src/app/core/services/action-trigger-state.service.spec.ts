import { ActionTriggerStateService } from './action-trigger-state.service'
import { ActionTriggerService } from '../../shared/abstractions/action-trigger.service'
import { ConnectionStatusObserver } from './connection-status-observer.service'
import { ActionTriggerEventObserver } from './action-trigger-event-observer.service'
import { instance, mock, when } from '@typestrong/ts-mockito'
import { of } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'

describe(ActionTriggerStateService.name, () => {
  it('should be created', () => {
    const actionTriggerService: ActionTriggerService = mock<ActionTriggerService>()
    when(actionTriggerService.getActionTriggers()).thenReturn(of([]))

    const connectionStatusObserver: ConnectionStatusObserver = mock(ConnectionStatusObserver)
    const actionTriggerEventObserver: ActionTriggerEventObserver = mock(ActionTriggerEventObserver)
    const mockedMatSnackBar = mock<MatSnackBar>()
    const testee: ActionTriggerStateService = new ActionTriggerStateService(
      instance(actionTriggerService),
      instance(connectionStatusObserver),
      instance(mockedMatSnackBar),
      instance(actionTriggerEventObserver)
    )

    expect(testee).toBeTruthy()
  })
})
