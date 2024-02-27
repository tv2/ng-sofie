import { ConnectionStatusObserver } from './connection-status-observer.service'
import { instance, mock, when } from '@typestrong/ts-mockito'
import { of } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ShelfConfigurationStateService } from './shelf-configuration-state.service'
import { ConfigurationService } from 'src/app/shared/services/configuration.service'
import { ConfigurationEventObserver } from './configuration-event-observer'

describe(ShelfConfigurationStateService.name, () => {
  it('should be created', () => {
    const configurationService: ConfigurationService = mock<ConfigurationService>()
    when(configurationService.getShelfConfiguration()).thenReturn(of())

    const connectionStatusObserver: ConnectionStatusObserver = mock(ConnectionStatusObserver)
    const configurationEventObserver: ConfigurationEventObserver = mock(ConfigurationEventObserver)
    const mockedMatSnackBar = mock<MatSnackBar>()
    const testee: ShelfConfigurationStateService = new ShelfConfigurationStateService(
      instance(configurationService),
      instance(connectionStatusObserver),
      instance(mockedMatSnackBar),
      instance(configurationEventObserver)
    )

    expect(testee).toBeTruthy()
  })
})
