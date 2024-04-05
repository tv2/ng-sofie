import { DialogService } from './dialog.service'
import { anyString, instance, mock, verify, when } from '@typestrong/ts-mockito'
import { RundownService } from '../../core/abstractions/rundown.service'
import { BasicRundownStateService } from '../../core/services/basic-rundown-state.service'
import { EMPTY, Observable, of } from 'rxjs'
import { TestEntityFactory } from '../../test/factories/test-entity.factory'
import { RundownMode } from '../../core/enums/rundown-mode'
import { Rundown } from '../../core/models/rundown'
import { DialogConfirmationService } from './dialog-confirmation.service'

describe(DialogConfirmationService.name, () => {
  it('should be created', () => {
    const testee: DialogConfirmationService = createTestee()

    expect(testee).toBeTruthy()
  })

  describe(DialogConfirmationService.prototype.openRehearsalRundownDialog.name, () => {
    it('should show dialog when all rundowns are idle when going for rehearsal', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()

      const mockedRundownService: RundownService = mock<RundownService>()

      const mockedSubscription: Observable<void> = mock<Observable<void>>()
      when(mockedRundownService.rehearse(anyString())).thenReturn(instance(mockedSubscription))

      const mockedDialogService: DialogService = createDialogServiceMock()

      const inactiveRundownOne = testEntityFactory.createRundown({ id: 'one', mode: RundownMode.INACTIVE })
      const inactiveRundownTwo = testEntityFactory.createRundown({ id: 'two', mode: RundownMode.INACTIVE })

      const mockedBasicRundownStateService: BasicRundownStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundownStateService.getBasicRundowns()).thenReturn([inactiveRundownOne, inactiveRundownTwo])

      const testee: DialogConfirmationService = createTestee({
        mockedBasicRundownStateService: mockedBasicRundownStateService,
        mockedRundownService: mockedRundownService,
        mockedDialogService: mockedDialogService,
      })
      testee.openRehearsalRundownDialog(inactiveRundownOne)

      verify(mockedDialogService.createConfirmDialog).once()
    })

    it('should show dialog when another rundown is already in active mode when going for rehearsal', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()

      const mockedRundownService: RundownService = mock<RundownService>()

      const emptyRehearseObservable: Observable<void> = EMPTY
      when(mockedRundownService.rehearse(anyString())).thenReturn(instance(emptyRehearseObservable))

      const mockedDeactivateSubscription: Observable<void> = mock<Observable<void>>()
      when(mockedRundownService.deactivate(anyString())).thenReturn(instance(mockedDeactivateSubscription))

      const mockedDialogService: DialogService = createDialogServiceMock()

      const activeRundown = testEntityFactory.createRundown({ id: 'another', mode: RundownMode.ACTIVE })
      const inactiveRundown = testEntityFactory.createRundown({ id: 'this', mode: RundownMode.INACTIVE })

      const mockedBasicRundownStateService: BasicRundownStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundownStateService.getBasicRundowns()).thenReturn([activeRundown, inactiveRundown])

      const testee: DialogConfirmationService = createTestee({
        mockedBasicRundownStateService: mockedBasicRundownStateService,
        mockedRundownService: mockedRundownService,
        mockedDialogService: mockedDialogService,
      })

      testee.openRehearsalRundownDialog(inactiveRundown)

      verify(mockedDialogService.createConfirmDialog).once()
    })

    it('should show dialog when another rundown is already in rehearsal mode when going for rehearsal', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()

      const mockedRundownService: RundownService = mock<RundownService>()

      const inactiveRundown = testEntityFactory.createRundown({ id: 'this', mode: RundownMode.INACTIVE })

      const emptyRehearseObservable: Observable<void> = EMPTY
      when(mockedRundownService.rehearse(inactiveRundown.id)).thenReturn(instance(emptyRehearseObservable))

      const rehearsalRundown = testEntityFactory.createRundown({ id: 'another', mode: RundownMode.REHEARSAL })

      const emptyDeactivateObservable: Observable<void> = EMPTY
      when(mockedRundownService.deactivate(rehearsalRundown.id)).thenReturn(instance(emptyDeactivateObservable))

      const mockedDialogService: DialogService = createDialogServiceMock()

      const mockedBasicRundownStateService: BasicRundownStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundownStateService.getBasicRundowns()).thenReturn([rehearsalRundown, inactiveRundown])

      const testee: DialogConfirmationService = createTestee({
        mockedBasicRundownStateService: mockedBasicRundownStateService,
        mockedRundownService: mockedRundownService,
        mockedDialogService: mockedDialogService,
      })
      testee.openRehearsalRundownDialog(inactiveRundown)

      verify(mockedDialogService.createConfirmDialog).once()
    })

    it('should not show dialog when same rundown is already in rehearsal mode when going for rehearsal', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const rehearsalRundown: Rundown = testEntityFactory.createRundown({ mode: RundownMode.REHEARSAL })

      const mockedRundownService: RundownService = mock<RundownService>()

      const mockedDialogService: DialogService = createDialogServiceMock()

      const mockedBasicRundownStateService: BasicRundownStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundownStateService.getBasicRundowns()).thenReturn([rehearsalRundown])

      const testee: DialogConfirmationService = createTestee({
        mockedBasicRundownStateService: mockedBasicRundownStateService,
        mockedRundownService: mockedRundownService,
        mockedDialogService: mockedDialogService,
      })
      testee.openRehearsalRundownDialog(rehearsalRundown)

      verify(mockedDialogService.createConfirmDialog).never()
    })
  })

  describe(DialogConfirmationService.prototype.openActivateRundownDialog.name, () => {
    it('should show dialog when all rundowns are idle when going for on-air', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const inactiveRundown: Rundown = testEntityFactory.createRundown({ id: 'this', mode: RundownMode.INACTIVE })

      const mockedRundownService: RundownService = mock<RundownService>()

      const emptyObservable: Observable<void> = EMPTY
      when(mockedRundownService.activate(inactiveRundown.id)).thenReturn(instance(emptyObservable))

      const mockedDialogService: DialogService = createDialogServiceMock()

      const mockedBasicRundownStateService: BasicRundownStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundownStateService.getBasicRundowns()).thenReturn([])

      const testee: DialogConfirmationService = createTestee({
        mockedBasicRundownStateService: mockedBasicRundownStateService,
        mockedRundownService: mockedRundownService,
        mockedDialogService: mockedDialogService,
      })
      testee.openActivateRundownDialog(inactiveRundown)

      verify(mockedDialogService.createConfirmDialog).once()
    })

    it('should show dialog when another rundown is already in active mode when going for on-air', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()

      const inactieRundown: Rundown = testEntityFactory.createRundown({ id: 'this', mode: RundownMode.INACTIVE })
      const activeRundown: Rundown = testEntityFactory.createRundown({ id: 'another', mode: RundownMode.ACTIVE })

      const mockedRundownService: RundownService = mock<RundownService>()

      const emptyActivateObservable: Observable<void> = EMPTY
      when(mockedRundownService.activate(inactieRundown.id)).thenReturn(instance(emptyActivateObservable))

      const emptyDeactivateObservable: Observable<void> = EMPTY
      when(mockedRundownService.deactivate(activeRundown.id)).thenReturn(instance(emptyDeactivateObservable))

      const mockedDialogService: DialogService = createDialogServiceMock()

      const mockedBasicRundownStateService: BasicRundownStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundownStateService.getBasicRundowns()).thenReturn([activeRundown, inactieRundown])

      const testee: DialogConfirmationService = createTestee({
        mockedBasicRundownStateService: mockedBasicRundownStateService,
        mockedRundownService: mockedRundownService,
        mockedDialogService: mockedDialogService,
      })
      testee.openActivateRundownDialog(inactieRundown)

      verify(mockedDialogService.createConfirmDialog).once()
    })

    it('should not show dialog when same rundown is already in active mode when going for on-air', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const actieRundown: Rundown = testEntityFactory.createRundown({ mode: RundownMode.ACTIVE })

      const mockedRundownService: RundownService = mock<RundownService>()

      const mockedDialogService: DialogService = createDialogServiceMock()

      const mockedBasicRundownStateService: BasicRundownStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundownStateService.getBasicRundowns()).thenReturn([actieRundown])

      const testee: DialogConfirmationService = createTestee({
        mockedBasicRundownStateService: mockedBasicRundownStateService,
        mockedRundownService: mockedRundownService,
        mockedDialogService: mockedDialogService,
      })
      testee.openActivateRundownDialog(actieRundown)

      verify(mockedDialogService.createConfirmDialog).never()
    })

    it('should show dialog when another rundown is already in rehearsal mode when going for on-air', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()

      const inactieRundown: Rundown = testEntityFactory.createRundown({ id: 'this', mode: RundownMode.INACTIVE })
      const rehearsalRundown: Rundown = testEntityFactory.createRundown({ id: 'another', mode: RundownMode.REHEARSAL })

      const mockedRundownService: RundownService = mock<RundownService>()

      const emptyActivateObservable: Observable<void> = EMPTY
      when(mockedRundownService.activate(inactieRundown.id)).thenReturn(instance(emptyActivateObservable))

      const emptyDeactivateObservable: Observable<void> = EMPTY
      when(mockedRundownService.deactivate(rehearsalRundown.id)).thenReturn(instance(emptyDeactivateObservable))

      const mockedDialogService: DialogService = createDialogServiceMock()

      const mockedBasicRundownStateService: BasicRundownStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundownStateService.getBasicRundowns()).thenReturn([rehearsalRundown, inactieRundown])

      const testee: DialogConfirmationService = createTestee({
        mockedBasicRundownStateService: mockedBasicRundownStateService,
        mockedRundownService: mockedRundownService,
        mockedDialogService: mockedDialogService,
      })
      testee.openActivateRundownDialog(inactieRundown)

      verify(mockedDialogService.createConfirmDialog).once()
    })

    it('should show dialog when same rundown is already in rehearsal mode when going for on-air', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const rehearsalRundown: Rundown = testEntityFactory.createRundown({ mode: RundownMode.REHEARSAL })

      const mockedRundownService: RundownService = mock<RundownService>()

      const mockedDialogService: DialogService = createDialogServiceMock()

      const mockedBasicRundownStateService: BasicRundownStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundownStateService.getBasicRundowns()).thenReturn([rehearsalRundown])

      const testee: DialogConfirmationService = createTestee({
        mockedBasicRundownStateService: mockedBasicRundownStateService,
        mockedRundownService: mockedRundownService,
        mockedDialogService: mockedDialogService,
      })
      testee.openActivateRundownDialog(rehearsalRundown)

      verify(mockedDialogService.createConfirmDialog).once()
    })
  })
})

function createTestee(params?: { mockedDialogService?: DialogService; mockedBasicRundownStateService?: BasicRundownStateService; mockedRundownService?: RundownService }): DialogConfirmationService {
  const mockedDialogService: DialogService = params?.mockedDialogService ?? createDialogServiceMock()
  const mockedBasicRundownStateService: BasicRundownStateService = params?.mockedBasicRundownStateService ?? mock<BasicRundownStateService>()
  const mockedRundownService: RundownService = params?.mockedRundownService ?? mock<RundownService>()

  return new DialogConfirmationService(instance(mockedDialogService), instance(mockedBasicRundownStateService), instance(mockedRundownService))
}

function createDialogServiceMock(): DialogService {
  const mockedDialogService: DialogService = mock<DialogService>()

  const openSpy = jasmine.createSpy().and.returnValue({ afterClosed: () => of(true) })
  when(mockedDialogService.createConfirmDialog).thenReturn(openSpy)

  return mockedDialogService
}
