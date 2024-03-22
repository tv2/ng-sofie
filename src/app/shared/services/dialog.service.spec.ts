import { DialogService } from './dialog.service'
import { anyString, instance, mock, verify, when } from '@typestrong/ts-mockito'
import { MatDialog } from '@angular/material/dialog'
import { RundownService } from '../../core/abstractions/rundown.service'
import { BasicRundownStateService } from '../../core/services/basic-rundown-state.service'
import { Observable, of } from 'rxjs'
import { TestEntityFactory } from '../../test/factories/test-entity.factory'
import { RundownMode } from '../../core/enums/rundown-mode'
import { Rundown } from '../../core/models/rundown'

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

  describe(DialogService.prototype.switchRehearsalRundownDialog.name, () => {
    it('should show dialog when all rundowns are idle when going for rehearsal', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()

      const mockedRunownService = mock<RundownService>()

      const mockedSubscription: Observable<void> = mock<Observable<void>>()
      when(mockedRunownService.rehearse(anyString())).thenReturn(instance(mockedSubscription))

      const mockedMatDialog: MatDialog = createMatDialogMock()

      const mockedBasicRundoStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundoStateService.getNonIdleRundown()).thenReturn(undefined)

      const testee: DialogService = createTestee({ mockedBasicRundownStateService: mockedBasicRundoStateService, mockedRundownService: mockedRunownService, mockedMatDialog: mockedMatDialog })
      testee.switchRehearsalRundownDialog(testEntityFactory.createRundown({ id: 'this', mode: RundownMode.INACTIVE }))

      verify(mockedMatDialog.open).once()
    })

    it('should show dialog when another rundown is already in active mode when going for rehearsal', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()

      const mockedRunownService = mock<RundownService>()

      const mockedRehearseSubscription: Observable<void> = mock<Observable<void>>()
      when(mockedRunownService.rehearse(anyString())).thenReturn(instance(mockedRehearseSubscription))

      const mockedDeactivateSubscription: Observable<void> = mock<Observable<void>>()
      when(mockedRunownService.deactivate(anyString())).thenReturn(instance(mockedDeactivateSubscription))

      const mockedMatDialog: MatDialog = createMatDialogMock()

      const mockedBasicRundoStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundoStateService.getNonIdleRundown()).thenReturn(testEntityFactory.createRundown({ mode: RundownMode.ACTIVE }))

      const testee: DialogService = createTestee({ mockedBasicRundownStateService: mockedBasicRundoStateService, mockedRundownService: mockedRunownService, mockedMatDialog: mockedMatDialog })
      testee.switchRehearsalRundownDialog(testEntityFactory.createRundown({ id: 'this' }))

      verify(mockedMatDialog.open).once()
    })

    it('should show dialog when another rundown is already in rehearsal mode when going for rehearsal', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()

      const mockedRunownService = mock<RundownService>()

      const mockedRehearseSubscription: Observable<void> = mock<Observable<void>>()
      when(mockedRunownService.rehearse('this')).thenReturn(instance(mockedRehearseSubscription))

      const mockedDeactivateSubscription: Observable<void> = mock<Observable<void>>()
      when(mockedRunownService.deactivate('another')).thenReturn(instance(mockedDeactivateSubscription))

      const mockedMatDialog: MatDialog = createMatDialogMock()

      const mockedBasicRundoStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundoStateService.getNonIdleRundown()).thenReturn(testEntityFactory.createRundown({ id: 'another', mode: RundownMode.REHEARSAL }))

      const testee: DialogService = createTestee({ mockedBasicRundownStateService: mockedBasicRundoStateService, mockedRundownService: mockedRunownService, mockedMatDialog: mockedMatDialog })
      testee.switchRehearsalRundownDialog(testEntityFactory.createRundown({ id: 'this', mode: RundownMode.INACTIVE }))

      verify(mockedMatDialog.open).once()
    })

    it('should not show dialog when same rundown is already in rehearsal mode when going for rehearsal', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const rundown: Rundown = testEntityFactory.createRundown({ mode: RundownMode.REHEARSAL })

      const mockedRunownService = mock<RundownService>()

      const mockedMatDialog: MatDialog = createMatDialogMock()

      const mockedBasicRundoStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundoStateService.getNonIdleRundown()).thenReturn(rundown)

      const testee: DialogService = createTestee({ mockedBasicRundownStateService: mockedBasicRundoStateService, mockedRundownService: mockedRunownService, mockedMatDialog: mockedMatDialog })
      testee.switchRehearsalRundownDialog(rundown)

      verify(mockedMatDialog.open).never()
    })
  })

  describe(DialogService.prototype.switchActivateRundownDialog.name, () => {
    it('should show dialog when all rundowns are idle when going for on-air', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const rundown: Rundown = testEntityFactory.createRundown({ id: 'this', mode: RundownMode.INACTIVE })

      const mockedRunownService = mock<RundownService>()

      const mockedSubscription: Observable<void> = mock<Observable<void>>()
      when(mockedRunownService.activate(rundown.id)).thenReturn(instance(mockedSubscription))

      const mockedMatDialog: MatDialog = createMatDialogMock()

      const mockedBasicRundoStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundoStateService.getNonIdleRundown()).thenReturn(undefined)

      const testee: DialogService = createTestee({ mockedBasicRundownStateService: mockedBasicRundoStateService, mockedRundownService: mockedRunownService, mockedMatDialog: mockedMatDialog })
      testee.switchActivateRundownDialog(rundown)

      verify(mockedMatDialog.open).once()
    })

    it('should show dialog when another rundown is already in active mode when going for on-air', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()

      const mockedRunownService = mock<RundownService>()

      const mockedActivateSubscription: Observable<void> = mock<Observable<void>>()
      when(mockedRunownService.activate('this')).thenReturn(instance(mockedActivateSubscription))

      const mockedDeactivateSubscription: Observable<void> = mock<Observable<void>>()
      when(mockedRunownService.deactivate('another')).thenReturn(instance(mockedDeactivateSubscription))

      const mockedMatDialog: MatDialog = createMatDialogMock()

      const mockedBasicRundoStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundoStateService.getNonIdleRundown()).thenReturn(testEntityFactory.createRundown({ id: 'another', mode: RundownMode.ACTIVE }))

      const testee: DialogService = createTestee({ mockedBasicRundownStateService: mockedBasicRundoStateService, mockedRundownService: mockedRunownService, mockedMatDialog: mockedMatDialog })
      testee.switchActivateRundownDialog(testEntityFactory.createRundown({ id: 'this', mode: RundownMode.INACTIVE }))

      verify(mockedMatDialog.open).once()
    })

    it('should not show dialog when same rundown is already in active mode when going for on-air', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const rundown: Rundown = testEntityFactory.createRundown({ mode: RundownMode.ACTIVE })

      const mockedRunownService = mock<RundownService>()

      const mockedMatDialog: MatDialog = createMatDialogMock()

      const mockedBasicRundoStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundoStateService.getNonIdleRundown()).thenReturn(rundown)

      const testee: DialogService = createTestee({ mockedBasicRundownStateService: mockedBasicRundoStateService, mockedRundownService: mockedRunownService, mockedMatDialog: mockedMatDialog })
      testee.switchActivateRundownDialog(rundown)

      verify(mockedMatDialog.open).never()
    })

    it('should show dialog when another rundown is already in rehearsal mode when going for on-air', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()

      const mockedRunownService = mock<RundownService>()

      const mockedActivateSubscription: Observable<void> = mock<Observable<void>>()
      when(mockedRunownService.activate('this')).thenReturn(instance(mockedActivateSubscription))

      const mockedDeactivateSubscription: Observable<void> = mock<Observable<void>>()
      when(mockedRunownService.deactivate('another')).thenReturn(instance(mockedDeactivateSubscription))

      const mockedMatDialog: MatDialog = createMatDialogMock()

      const mockedBasicRundoStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundoStateService.getNonIdleRundown()).thenReturn(testEntityFactory.createRundown({ id: 'another', mode: RundownMode.REHEARSAL }))

      const testee: DialogService = createTestee({ mockedBasicRundownStateService: mockedBasicRundoStateService, mockedRundownService: mockedRunownService, mockedMatDialog: mockedMatDialog })
      testee.switchActivateRundownDialog(testEntityFactory.createRundown({ id: 'this', mode: RundownMode.INACTIVE }))

      verify(mockedMatDialog.open).once()
    })
  })
})

function createTestee(params?: { mockedMatDialog?: MatDialog; mockedBasicRundownStateService?: BasicRundownStateService; mockedRundownService?: RundownService }): DialogService {
  const mockedMatDialog: MatDialog = params?.mockedMatDialog ?? createMatDialogMock()
  const mockedBasicRundownStateService: BasicRundownStateService = params?.mockedBasicRundownStateService ?? mock<BasicRundownStateService>()
  const mockedRundownService: RundownService = params?.mockedRundownService ?? mock<RundownService>()

  return new DialogService(instance(mockedMatDialog), instance(mockedBasicRundownStateService), instance(mockedRundownService))
}

function createMatDialogMock(): MatDialog {
  const mockedMatDialog = mock<MatDialog>()

  const openSpy = jasmine.createSpy().and.returnValue({ afterClosed: () => of(true) })
  when(mockedMatDialog.open).thenReturn(openSpy)

  return mockedMatDialog
}
