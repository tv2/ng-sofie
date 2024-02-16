import { MiniShelfCycleService } from './mini-shelf-cycle.service'
import { ActionService } from '../../shared/abstractions/action.service'
import { anything, instance, mock, when } from '@typestrong/ts-mockito'
import { Observable } from 'rxjs'
import { MiniShelfNavigationService } from './mini-shelf-navigation.service'
import { ActionStateService } from '../../shared/services/action-state.service'

describe(MiniShelfCycleService.name, () => {
  it('should create', () => {
    const miniShelfNavigationServiceMock: MiniShelfNavigationService = mock<MiniShelfNavigationService>()

    const actionStateServiceMock: ActionStateService = mock<ActionStateService>()

    const actionServiceMock: ActionService = mock<ActionService>()

    const testee: MiniShelfCycleService = createTestee({ actionService: actionServiceMock, actionStateService: actionStateServiceMock, miniShelfNavigationService: miniShelfNavigationServiceMock })

    expect(testee).toBeTruthy()
  })
})
function createTestee(params?: { actionService?: ActionService; miniShelfNavigationService?: MiniShelfNavigationService; actionStateService?: ActionStateService }): MiniShelfCycleService {
  let miniShelfNavigationService: MiniShelfNavigationService
  if (!params?.miniShelfNavigationService) {
    const miniShelfNavigationServiceMock: MiniShelfNavigationService = mock<MiniShelfNavigationService>()
    miniShelfNavigationService = instance(miniShelfNavigationServiceMock)
  }

  let actionStateService: ActionStateService
  if (!params?.actionStateService) {
    const actionStateServiceMock: ActionStateService = mock<ActionStateService>()
    actionStateService = instance(actionStateServiceMock)
  }

  let actionService: ActionService
  if (!params?.actionService) {
    const actionServiceMock: ActionService = mock<ActionService>()
    when(actionServiceMock.executeAction(anything(), anything())).thenReturn(instance(mock<Observable<void>>()))
    actionService = instance(actionServiceMock)
  }

  return new MiniShelfCycleService(params?.miniShelfNavigationService ?? miniShelfNavigationService!, params?.actionStateService ?? actionStateService!, params?.actionService ?? actionService!)
}
