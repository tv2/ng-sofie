import { DialogService } from './dialog.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { MatDialog } from '@angular/material/dialog'

describe('DialogService', () => {
  it('should be created', () => {
    const mockedMatDialog = mock<MatDialog>()
    expect(new DialogService(instance(mockedMatDialog))).toBeTruthy()
  })
})
