import { DialogService } from './dialog.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { MatDialog } from '@angular/material/dialog'
import { RundownService } from '../../core/abstractions/rundown.service'
import { BasicRundownStateService } from '../../core/services/basic-rundown-state.service'

describe('DialogService', () => {
  it('should be created', () => {
    const mockedMatDialog = mock<MatDialog>()
    const mockedBasicRundownStateService = mock<BasicRundownStateService>()
    const mockedRundownService = mock<RundownService>()

    const testee: DialogService = new DialogService(instance(mockedMatDialog), instance(mockedBasicRundownStateService), instance(mockedRundownService))
    expect(testee).toBeTruthy()
  })
})
