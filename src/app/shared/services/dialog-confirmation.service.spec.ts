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

      const mockedRunownService = mock<RundownService>()

      const mockedSubscription: Observable<void> = mock<Observable<void>>()
      when(mockedRunownService.rehearse(anyString())).thenReturn(instance(mockedSubscription))

      const mockedDialogService: DialogService = createDialogServiceMock()

      const mockedBasicRundoStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundoStateService.getBasicRundowns()).thenReturn([])

      const testee: DialogConfirmationService = createTestee({
        mockedBasicRundownStateService: mockedBasicRundoStateService,
        mockedRundownService: mockedRunownService,
        mockedDialogService: mockedDialogService,
      })
      testee.openRehearsalRundownDialog(testEntityFactory.createRundown({ id: 'this', mode: RundownMode.INACTIVE }))

      verify(mockedDialogService.createConfirmDialog).once()
    })

    it('should show dialog when another rundown is already in active mode when going for rehearsal', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()

      const mockedRunownService = mock<RundownService>()

      const mockedRehearseSubscription: Observable<void> = EMPTY
      when(mockedRunownService.rehearse(anyString())).thenReturn(instance(mockedRehearseSubscription))

      const mockedDeactivateSubscription: Observable<void> = mock<Observable<void>>()
      when(mockedRunownService.deactivate(anyString())).thenReturn(instance(mockedDeactivateSubscription))

      const mockedDialogService: DialogService = createDialogServiceMock()

      const mockedBasicRundoStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundoStateService.getBasicRundowns()).thenReturn([testEntityFactory.createRundown({ mode: RundownMode.ACTIVE })])

      const testee: DialogConfirmationService = createTestee({
        mockedBasicRundownStateService: mockedBasicRundoStateService,
        mockedRundownService: mockedRunownService,
        mockedDialogService: mockedDialogService,
      })
      testee.openRehearsalRundownDialog(testEntityFactory.createRundown({ id: 'this' }))

      verify(mockedDialogService.createConfirmDialog).once()
    })

    it('should show dialog when another rundown is already in rehearsal mode when going for rehearsal', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()

      const mockedRunownService = mock<RundownService>()

      const mockedRehearseSubscription: Observable<void> = EMPTY
      when(mockedRunownService.rehearse('this')).thenReturn(instance(mockedRehearseSubscription))

      const mockedDeactivateSubscription: Observable<void> = EMPTY
      when(mockedRunownService.deactivate('another')).thenReturn(instance(mockedDeactivateSubscription))

      const mockedDialogService: DialogService = createDialogServiceMock()

      const mockedBasicRundoStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundoStateService.getBasicRundowns()).thenReturn([testEntityFactory.createRundown({ id: 'another', mode: RundownMode.REHEARSAL })])

      const testee: DialogConfirmationService = createTestee({
        mockedBasicRundownStateService: mockedBasicRundoStateService,
        mockedRundownService: mockedRunownService,
        mockedDialogService: mockedDialogService,
      })
      testee.openRehearsalRundownDialog(testEntityFactory.createRundown({ id: 'this', mode: RundownMode.INACTIVE }))

      verify(mockedDialogService.createConfirmDialog).once()
    })

    it('should not show dialog when same rundown is already in rehearsal mode when going for rehearsal', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const rundown: Rundown = testEntityFactory.createRundown({ mode: RundownMode.REHEARSAL })

      const mockedRunownService = mock<RundownService>()

      const mockedDialogService: DialogService = createDialogServiceMock()

      const mockedBasicRundoStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundoStateService.getBasicRundowns()).thenReturn([rundown])

      const testee: DialogConfirmationService = createTestee({
        mockedBasicRundownStateService: mockedBasicRundoStateService,
        mockedRundownService: mockedRunownService,
        mockedDialogService: mockedDialogService,
      })
      testee.openRehearsalRundownDialog(rundown)

      verify(mockedDialogService.createConfirmDialog).never()
    })
  })

  describe(DialogConfirmationService.prototype.openActivateRundownDialog.name, () => {
    it('should show dialog when all rundowns are idle when going for on-air', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const rundown: Rundown = testEntityFactory.createRundown({ id: 'this', mode: RundownMode.INACTIVE })

      const mockedRunownService = mock<RundownService>()

      const mockedSubscription: Observable<void> = EMPTY
      when(mockedRunownService.activate(rundown.id)).thenReturn(instance(mockedSubscription))

      const mockedDialogService: DialogService = createDialogServiceMock()

      const mockedBasicRundoStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundoStateService.getBasicRundowns()).thenReturn([])

      const testee: DialogConfirmationService = createTestee({
        mockedBasicRundownStateService: mockedBasicRundoStateService,
        mockedRundownService: mockedRunownService,
        mockedDialogService: mockedDialogService,
      })
      testee.openActivateRundownDialog(rundown)

      verify(mockedDialogService.createConfirmDialog).once()
    })

    it('should show dialog when another rundown is already in active mode when going for on-air', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()

      const mockedRunownService = mock<RundownService>()

      const mockedActivateSubscription: Observable<void> = EMPTY
      when(mockedRunownService.activate('this')).thenReturn(instance(mockedActivateSubscription))

      const mockedDeactivateSubscription: Observable<void> = EMPTY
      when(mockedRunownService.deactivate('another')).thenReturn(instance(mockedDeactivateSubscription))

      const mockedDialogService: DialogService = createDialogServiceMock()

      const mockedBasicRundoStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundoStateService.getBasicRundowns()).thenReturn([testEntityFactory.createRundown({ id: 'another', mode: RundownMode.ACTIVE })])

      const testee: DialogConfirmationService = createTestee({
        mockedBasicRundownStateService: mockedBasicRundoStateService,
        mockedRundownService: mockedRunownService,
        mockedDialogService: mockedDialogService,
      })
      testee.openActivateRundownDialog(testEntityFactory.createRundown({ id: 'this', mode: RundownMode.INACTIVE }))

      verify(mockedDialogService.createConfirmDialog).once()
    })

    it('should not show dialog when same rundown is already in active mode when going for on-air', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const rundown: Rundown = testEntityFactory.createRundown({ mode: RundownMode.ACTIVE })

      const mockedRunownService = mock<RundownService>()

      const mockedDialogService: DialogService = createDialogServiceMock()

      const mockedBasicRundoStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundoStateService.getBasicRundowns()).thenReturn([rundown])

      const testee: DialogConfirmationService = createTestee({
        mockedBasicRundownStateService: mockedBasicRundoStateService,
        mockedRundownService: mockedRunownService,
        mockedDialogService: mockedDialogService,
      })
      testee.openActivateRundownDialog(rundown)

      verify(mockedDialogService.createConfirmDialog).never()
    })

    it('should show dialog when another rundown is already in rehearsal mode when going for on-air', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()

      const mockedRunownService = mock<RundownService>()

      const mockedActivateSubscription: Observable<void> = EMPTY
      when(mockedRunownService.activate('this')).thenReturn(instance(mockedActivateSubscription))

      const mockedDeactivateSubscription: Observable<void> = EMPTY
      when(mockedRunownService.deactivate('another')).thenReturn(instance(mockedDeactivateSubscription))

      const mockedDialogService: DialogService = createDialogServiceMock()

      const mockedBasicRundoStateService = mock<BasicRundownStateService>()
      when(mockedBasicRundoStateService.getBasicRundowns()).thenReturn([testEntityFactory.createRundown({ id: 'another', mode: RundownMode.REHEARSAL })])

      const testee: DialogConfirmationService = createTestee({
        mockedBasicRundownStateService: mockedBasicRundoStateService,
        mockedRundownService: mockedRunownService,
        mockedDialogService: mockedDialogService,
      })
      testee.openActivateRundownDialog(testEntityFactory.createRundown({ id: 'this', mode: RundownMode.INACTIVE }))

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
