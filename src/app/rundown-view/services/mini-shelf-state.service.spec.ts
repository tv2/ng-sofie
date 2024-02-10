import { MiniShelfStateService } from './mini-shelf-state.service'
import { anything, instance, mock, verify, when } from '@typestrong/ts-mockito'
import { RundownEventObserver } from '../../core/services/rundown-event-observer.service'
import { ActionService } from '../../shared/abstractions/action.service'
import { Rundown } from '../../core/models/rundown'
import { Segment } from '../../core/models/segment'
import { Tv2SegmentMetadata } from '../../core/models/tv2-segment-metadata'
import { Tv2ActionContentType, Tv2VideoClipAction } from '../../shared/models/tv2-action'
import { Observable } from 'rxjs'
import { PartTakenEvent, RundownActivatedEvent } from '../../core/models/rundown-event'
import { TestEntityFactory } from '../../test/factories/test-entity.factory'

describe(MiniShelfStateService.name, (): void => {
  describe(MiniShelfStateService.prototype.setActions.name, (): void => {
    it('cycling in any direction will not work when no segment On Air', (): void => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const onAirSegment: Segment = testEntityFactory.createSegment({ id: 'onAirSegmentId', isOnAir: false })
      const miniShelfSegmentOne: Segment = createMiniShelfSegment({ id: 'miniShelfSegmentOne', miniShelfVideoClipFile: 'fileOne' })
      const miniShelfSegmentTwo: Segment = createMiniShelfSegment({ id: 'miniShelfSegmentTwo', miniShelfVideoClipFile: 'fileTwo' })
      const miniShelfSegmentThree: Segment = createMiniShelfSegment({ id: 'miniShelfSegmentThree', miniShelfVideoClipFile: 'fileThree' })
      const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments: [onAirSegment, miniShelfSegmentOne, miniShelfSegmentTwo, miniShelfSegmentThree] })

      const rundownEventObserver: RundownEventObserver = createRundownEventObserverWithCallbacks({ activeRundownId: rundown.id, onAirSegmentId: onAirSegment.id })
      spyOn(rundownEventObserver, 'subscribeToRundownActivation')
      spyOn(rundownEventObserver, 'subscribeToRundownTake')

      const actionService: ActionService = mock<ActionService>()
      when(actionService.executeAction(anything(), anything())).thenReturn(instance(mock<Observable<void>>()))

      const miniShelfActionRecord: Record<string, Tv2VideoClipAction> = {
        [miniShelfSegmentOne.id]: createVideoClipAction(miniShelfSegmentOne.metadata?.miniShelfVideoClipFile),
        [miniShelfSegmentTwo.id]: createVideoClipAction(miniShelfSegmentTwo.metadata?.miniShelfVideoClipFile),
        [miniShelfSegmentThree.id]: createVideoClipAction(miniShelfSegmentThree.metadata?.miniShelfVideoClipFile),
      }

      const testee: MiniShelfStateService = createTestee({ actionService: instance(actionService), rundownEventObserver })
      testee.setActions(miniShelfActionRecord)
      testee.updateMiniShelves(rundown)

      expect(rundownEventObserver.subscribeToRundownActivation).toHaveBeenCalled()
      expect(rundownEventObserver.subscribeToRundownTake).toHaveBeenCalled()

      testee.cycleMiniShelfForward()
      testee.cycleMiniShelfBackward()
      verify(actionService.executeAction(anything(), anything())).never()
    })

    it('cycling in any direction will not work when actions are not set', (): void => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const onAirSegment: Segment = testEntityFactory.createSegment({ id: 'onAirSegmentId', isOnAir: true })
      const miniShelfSegmentOne: Segment = createMiniShelfSegment({ id: 'miniShelfSegmentOne', miniShelfVideoClipFile: 'fileOne' })
      const miniShelfSegmentTwo: Segment = createMiniShelfSegment({ id: 'miniShelfSegmentTwo', miniShelfVideoClipFile: 'fileTwo' })
      const miniShelfSegmentThree: Segment = createMiniShelfSegment({ id: 'miniShelfSegmentThree', miniShelfVideoClipFile: 'fileThree' })
      const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments: [onAirSegment, miniShelfSegmentOne, miniShelfSegmentTwo, miniShelfSegmentThree] })

      const rundownEventObserver: RundownEventObserver = createRundownEventObserverWithCallbacks({ activeRundownId: rundown.id, onAirSegmentId: onAirSegment.id })
      const actionService: ActionService = mock<ActionService>()
      when(actionService.executeAction(anything(), anything())).thenReturn(instance(mock<Observable<void>>()))

      const testee: MiniShelfStateService = createTestee({ actionService: instance(actionService), rundownEventObserver })
      testee.updateMiniShelves(rundown)

      testee.cycleMiniShelfForward()
      testee.cycleMiniShelfBackward()
      verify(actionService.executeAction(anything(), anything())).never()
    })
  })

  describe(MiniShelfStateService.prototype.updateMiniShelves.name, (): void => {
    it('cycling in any direction will not work when MiniShelves are not updated', (): void => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const onAirSegment: Segment = testEntityFactory.createSegment({ id: 'onAirSegmentId', isOnAir: true })
      const miniShelfSegmentOne: Segment = createMiniShelfSegment({ id: 'miniShelfSegmentOne', miniShelfVideoClipFile: 'fileOne' })
      const miniShelfSegmentTwo: Segment = createMiniShelfSegment({ id: 'miniShelfSegmentTwo', miniShelfVideoClipFile: 'fileTwo' })
      const miniShelfSegmentThree: Segment = createMiniShelfSegment({ id: 'miniShelfSegmentThree', miniShelfVideoClipFile: 'fileThree' })
      const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments: [onAirSegment, miniShelfSegmentOne, miniShelfSegmentTwo, miniShelfSegmentThree] })

      const rundownEventObserver: RundownEventObserver = createRundownEventObserverWithCallbacks({ activeRundownId: rundown.id, onAirSegmentId: onAirSegment.id })
      const actionService: ActionService = mock<ActionService>()
      when(actionService.executeAction(anything(), anything())).thenReturn(instance(mock<Observable<void>>()))

      const miniShelfActionRecord: Record<string, Tv2VideoClipAction> = {
        [miniShelfSegmentOne.id]: createVideoClipAction(miniShelfSegmentOne.metadata?.miniShelfVideoClipFile),
        [miniShelfSegmentTwo.id]: createVideoClipAction(miniShelfSegmentTwo.metadata?.miniShelfVideoClipFile),
        [miniShelfSegmentThree.id]: createVideoClipAction(miniShelfSegmentThree.metadata?.miniShelfVideoClipFile),
      }

      const testee: MiniShelfStateService = createTestee({ actionService: instance(actionService), rundownEventObserver })
      testee.setActions(miniShelfActionRecord)

      testee.cycleMiniShelfForward()
      testee.cycleMiniShelfBackward()
      verify(actionService.executeAction(anything(), anything())).never()
    })
  })

  describe(MiniShelfStateService.prototype.cycleMiniShelfForward.name, (): void => {
    it('can execute the Action of the first miniShelf then on the next', (): void => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const onAirSegment: Segment = testEntityFactory.createSegment({ id: 'onAirSegmentId', isOnAir: true })
      const miniShelfSegmentOne: Segment = createMiniShelfSegment({ id: 'miniShelfSegmentOne', miniShelfVideoClipFile: 'fileOne' })
      const miniShelfSegmentTwo: Segment = createMiniShelfSegment({ id: 'miniShelfSegmentTwo', miniShelfVideoClipFile: 'fileTwo' })
      const miniShelfSegmentThree: Segment = createMiniShelfSegment({ id: 'miniShelfSegmentThree', miniShelfVideoClipFile: 'fileThree' })
      const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments: [onAirSegment, miniShelfSegmentOne, miniShelfSegmentTwo, miniShelfSegmentThree] })

      const rundownEventObserver: RundownEventObserver = createRundownEventObserverWithCallbacks({ activeRundownId: rundown.id, onAirSegmentId: onAirSegment.id })
      const actionService: ActionService = mock<ActionService>()
      when(actionService.executeAction(anything(), anything())).thenReturn(instance(mock<Observable<void>>()))

      const miniShelfActionRecord: Record<string, Tv2VideoClipAction> = {
        [miniShelfSegmentOne.id]: createVideoClipAction(miniShelfSegmentOne.metadata?.miniShelfVideoClipFile),
        [miniShelfSegmentTwo.id]: createVideoClipAction(miniShelfSegmentTwo.metadata?.miniShelfVideoClipFile),
        [miniShelfSegmentThree.id]: createVideoClipAction(miniShelfSegmentThree.metadata?.miniShelfVideoClipFile),
      }

      const testee: MiniShelfStateService = createTestee({ actionService: instance(actionService), rundownEventObserver })
      testee.updateMiniShelves(rundown)
      testee.setActions(miniShelfActionRecord)

      testee.cycleMiniShelfForward()
      verify(actionService.executeAction(miniShelfActionRecord[miniShelfSegmentOne.id].id, anything())).once()
      testee.cycleMiniShelfForward()
      verify(actionService.executeAction(miniShelfActionRecord[miniShelfSegmentTwo.id].id, anything())).once()
      verify(actionService.executeAction(miniShelfActionRecord[miniShelfSegmentThree.id].id, anything())).never()
    })
  })

  describe(MiniShelfStateService.prototype.cycleMiniShelfBackward.name, (): void => {
    it('can execute the Action of the last miniShelf then on the previous', (): void => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const onAirSegment: Segment = testEntityFactory.createSegment({ id: 'onAirSegmentId', isOnAir: true })
      const miniShelfSegmentOne: Segment = createMiniShelfSegment({ id: 'miniShelfSegmentOne', miniShelfVideoClipFile: 'fileOne' })
      const miniShelfSegmentTwo: Segment = createMiniShelfSegment({ id: 'miniShelfSegmentTwo', miniShelfVideoClipFile: 'fileTwo' })
      const miniShelfSegmentThree: Segment = createMiniShelfSegment({ id: 'miniShelfSegmentThree', miniShelfVideoClipFile: 'fileThree' })
      const rundown: Rundown = testEntityFactory.createRundown({ isActive: true, segments: [onAirSegment, miniShelfSegmentOne, miniShelfSegmentTwo, miniShelfSegmentThree] })

      const rundownEventObserver: RundownEventObserver = createRundownEventObserverWithCallbacks({ activeRundownId: rundown.id, onAirSegmentId: onAirSegment.id })
      const actionService: ActionService = mock<ActionService>()
      when(actionService.executeAction(anything(), anything())).thenReturn(instance(mock<Observable<void>>()))

      const miniShelfActionRecord: Record<string, Tv2VideoClipAction> = {
        [miniShelfSegmentOne.id]: createVideoClipAction(miniShelfSegmentOne.metadata?.miniShelfVideoClipFile),
        [miniShelfSegmentTwo.id]: createVideoClipAction(miniShelfSegmentTwo.metadata?.miniShelfVideoClipFile),
        [miniShelfSegmentThree.id]: createVideoClipAction(miniShelfSegmentThree.metadata?.miniShelfVideoClipFile),
      }

      const testee: MiniShelfStateService = createTestee({ actionService: instance(actionService), rundownEventObserver })

      testee.updateMiniShelves(rundown)
      testee.setActions(miniShelfActionRecord)

      testee.cycleMiniShelfBackward()
      verify(actionService.executeAction(miniShelfActionRecord[miniShelfSegmentThree.id].id, anything())).once()
      testee.cycleMiniShelfBackward()
      verify(actionService.executeAction(miniShelfActionRecord[miniShelfSegmentTwo.id].id, anything())).once()
      verify(actionService.executeAction(miniShelfActionRecord[miniShelfSegmentOne.id].id, anything())).never()
    })
  })
})

function createTestee(params?: { actionService?: ActionService; rundownEventObserver?: RundownEventObserver }): MiniShelfStateService {
  let actionService: ActionService
  if (!params?.actionService) {
    const actionServiceMock: ActionService = mock<ActionService>()
    when(actionServiceMock.executeAction(anything(), anything())).thenReturn(instance(mock<Observable<void>>()))
    actionService = instance(actionServiceMock)
  }
  return new MiniShelfStateService(params?.actionService ?? actionService!, params?.rundownEventObserver ?? instance(mock<RundownEventObserver>()))
}

function createMiniShelfSegment(params?: { id?: string; miniShelfVideoClipFile?: string }): Segment {
  const segmentMetadata: Tv2SegmentMetadata = {
    miniShelfVideoClipFile: params?.miniShelfVideoClipFile ?? 'someFileName',
  }
  return new TestEntityFactory().createSegment({ id: params?.id ?? 'segmentId', isHidden: true, metadata: segmentMetadata })
}

function createVideoClipAction(fileName?: string): Tv2VideoClipAction {
  return {
    id: `actionId_${fileName ?? 'someFileName'}`,
    metadata: {
      contentType: Tv2ActionContentType.VIDEO_CLIP,
      fileName: fileName ?? 'someFileName',
    },
  } as Tv2VideoClipAction
}

function createRundownEventObserverWithCallbacks(params?: { activeRundownId?: string; onAirSegmentId?: string }): RundownEventObserver {
  const rundownEventObserver: RundownEventObserver = mock<RundownEventObserver>()

  const rundownActivationEvent: RundownActivatedEvent = {
    rundownId: params?.activeRundownId ?? 'activeRundownId',
  } as RundownActivatedEvent
  when(rundownEventObserver.subscribeToRundownActivation(anything())).thenCall(value => value(rundownActivationEvent))

  const partTakenEvent: PartTakenEvent = {
    segmentId: params?.onAirSegmentId ?? 'onAirSegmentId',
  } as PartTakenEvent
  when(rundownEventObserver.subscribeToRundownTake(anything())).thenCall(value => value(partTakenEvent))

  return instance(rundownEventObserver)
}
