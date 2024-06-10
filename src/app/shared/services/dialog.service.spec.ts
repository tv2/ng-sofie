import { DialogService } from './dialog.service'
import { instance, mock, when } from '@typestrong/ts-mockito'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { RundownService } from '../../core/abstractions/rundown.service'
import { BasicRundownStateService } from '../../core/services/basic-rundown-state.service'
import { of } from 'rxjs'

describe(DialogService.name, () => {
  it('should be created', () => {
    const testee: DialogService = createTestee()

    expect(testee).toBeTruthy()
  })

  describe(DialogService.prototype.createConfirmDialog.name, () => {
    it('should call dialog once per invocation', () => {
      const mockedMatDialog = mock<MatDialog>()

      const openSpy = jasmine.createSpy().and.returnValue({ afterClosed: () => of(true) })
      when(mockedMatDialog.open).thenReturn(openSpy)

      const testee: DialogService = createTestee({ mockedMatDialog: mockedMatDialog })

      testee.createConfirmDialog('title', 'message', 'ok', () => {}, undefined)

      expect(openSpy).toHaveBeenCalledOnceWith(jasmine.any(Function), jasmine.any(Object))
    })
  })
})

function createTestee(params?: { mockedMatDialog?: MatDialog; mockedBasicRundownStateService?: BasicRundownStateService; mockedRundownService?: RundownService }): DialogService {
  const mockedMatDialog: MatDialog = params?.mockedMatDialog ?? createMatDialogMock()

  return new DialogService(instance(mockedMatDialog))
}

function createMatDialogMock(): MatDialog {
  const mockedMatDialog = mock<MatDialog>()

  const openSpy = jasmine.createSpy().and.returnValue({ afterClosed: () => of(true) })
  when(mockedMatDialog.open).thenReturn(openSpy)

  return mockedMatDialog
}
