import { ConnectionErrorService } from './connection-error.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { ConnectionStatusObserver } from '../../core/services/connection-status-observer.service'
import { MatSnackBar } from '@angular/material/snack-bar'

describe('ConnectionErrorService', () => {
  it('should be created', () => {
    const mockedMatSnackBar = mock<MatSnackBar>()
    const mockedConnectionStatusObserver = mock<ConnectionStatusObserver>()
    expect(new ConnectionErrorService(instance(mockedMatSnackBar), instance(mockedConnectionStatusObserver))).toBeTruthy()
  })
})
