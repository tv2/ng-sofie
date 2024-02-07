import { MiniShelfStateService } from './mini-shelf-state.service'
import { anyString, anything, instance, mock, when } from '@typestrong/ts-mockito'
import { RundownEventObserver } from '../../core/services/rundown-event-observer.service'
import { ActionService } from '../../shared/abstractions/action.service'
import { Rundown } from '../../core/models/rundown'
import { Segment } from '../../core/models/segment'
import { Tv2SegmentMetadata } from '../../core/models/tv2-segment-metadata'
import { Tv2ActionContentType, Tv2VideoClipAction } from '../../shared/models/tv2-action'
import { Observable } from 'rxjs'
import { PartSetAsNextEvent, PartTakenEvent } from '../../core/models/rundown-event'

describe(MiniShelfStateService.name, (): void => {
  it('should create', (): void => {
    const testee: MiniShelfStateService = createMinimalTestee()
    expect(testee).toBeTruthy()
  })

  describe(MiniShelfStateService.prototype.setActions.name, (): void => {
    it('should be defined', (): void => {
      const testee: MiniShelfStateService = createMinimalTestee()
      expect(testee.setActions).toBeDefined()
    })
    it('should set the miniShelfSegmentActionMappings', (): void => {
      const testee: MiniShelfStateService = createMinimalTestee()
      const mockedTv2VideoClipAction1: Tv2VideoClipAction = mock<Tv2VideoClipAction>()
      const tv2VideoClipAction1: Tv2VideoClipAction = instance(mockedTv2VideoClipAction1)
      const mockedTv2VideoClipAction2: Tv2VideoClipAction = mock<Tv2VideoClipAction>()
      const tv2VideoClipAction2: Tv2VideoClipAction = instance(mockedTv2VideoClipAction2)
      testee.setActions({ first: tv2VideoClipAction1, second: tv2VideoClipAction2 })
      expect(testee['miniShelfSegmentActionMappings']).toEqual({
        first: tv2VideoClipAction1,
        second: tv2VideoClipAction2,
      })
    })
  })

  describe(MiniShelfStateService.prototype.updateMiniShelves.name, (): void => {
    it('should be defined', (): void => {
      const testee: MiniShelfStateService = createMinimalTestee()
      expect(testee.updateMiniShelves).toBeDefined()
    })
    it('should set the miniShelfGroups', (): void => {
      const testee: MiniShelfStateService = createMinimalTesteeMiniShelfGroups()
      expect(testee['miniShelfGroups'].size).toEqual(1)
    })
  })

  describe(MiniShelfStateService.prototype.executeVideoClipActionForSegment.name, (): void => {
    it('should be defined', (): void => {
      const testee: MiniShelfStateService = createMinimalTestee()
      expect(testee.executeVideoClipActionForSegment).toBeDefined()
    })
  })

  describe(MiniShelfStateService.prototype.cycleMiniShelfForward.name, (): void => {
    it('should be defined', (): void => {
      const testee: MiniShelfStateService = createMinimalTestee()
      expect(testee.cycleMiniShelfForward).toBeDefined()
    })
    it('should set the nextSegmentId to the first segment in the next miniShelfGroup', (): void => {
      const testee: MiniShelfStateService = createMinimalTesteeCycleMiniShelfAny()
      testee.cycleMiniShelfForward()
      expect(testee['nextSegmentId']).toEqual('mockedSegment4Id')
    })
  })

  describe(MiniShelfStateService.prototype.cycleMiniShelfBackward.name, (): void => {
    it('should be defined', (): void => {
      const testee: MiniShelfStateService = createMinimalTestee()
      expect(testee.cycleMiniShelfBackward).toBeDefined()
    })
    it('should set the nextSegmentId to the last segment in the last miniShelfGroup', (): void => {
      // const testee: MiniShelfStateService = createMinimalTesteeCycleMiniShelfAny()
      const testee: MiniShelfStateService = createMinimalTesteeCycleMiniShelfBackward()
      testee.cycleMiniShelfBackward()
      expect(testee['nextSegmentId']).toEqual('mockedSegment3Id')
    })
  })

  describe(MiniShelfStateService.prototype.findMiniShelfGroup.name, (): void => {
    it('should be defined', (): void => {
      const testee: MiniShelfStateService = createMinimalTestee()
      expect(testee.findMiniShelfGroup).toBeDefined()
    })
    it('should return MiniShelf when there is a MiniShelf in Segments', (): void => {
      const testee: MiniShelfStateService = createMinimalTesteeCycleMiniShelfAny()
      expect(testee.findMiniShelfGroup()[0].id).toEqual('mockedSegmentId')
    })
  })
})

function createRundownEventObserverMock(): RundownEventObserver {
  const mockedPartTakenEvent: PartTakenEvent = mock<PartTakenEvent>()
  when(mockedPartTakenEvent.rundownId).thenReturn('mockedRundownId')
  when(mockedPartTakenEvent.segmentId).thenReturn('mockedSegment3Id')
  when(mockedPartTakenEvent.partId).thenReturn('mockedPartId')
  const partTakenEvent: PartTakenEvent = instance(mockedPartTakenEvent)
  const mockedRundownEventObserver: RundownEventObserver = mock<RundownEventObserver>()
  when(mockedRundownEventObserver.subscribeToRundownTake(anything())).thenCall(value => value(partTakenEvent))

  const mockedPartAsNextEvent: PartSetAsNextEvent = mock<PartSetAsNextEvent>()
  when(mockedPartAsNextEvent.segmentId).thenReturn('mockedSegment4Id')
  when(mockedPartAsNextEvent.partId).thenReturn('mockedPartId')
  const partAsNextEvent: PartSetAsNextEvent = instance(mockedPartAsNextEvent)
  when(mockedRundownEventObserver.subscribeToRundownSetNext(anything())).thenCall(value => value(partAsNextEvent))
  return mockedRundownEventObserver
}

function createActionServiceMock(): ActionService {
  const mockedActionService: ActionService = mock<ActionService>()
  const mockedObservable: Observable<void> = mock<Observable<void>>()
  when(mockedActionService.executeAction(anyString(), anyString())).thenReturn(instance(mockedObservable))
  return mockedActionService
}

function createMinimalTestee(
  params: {
    mockedActionService?: ActionService
    mockedRundownEventObserver?: RundownEventObserver
  } = {}
): MiniShelfStateService {
  const mockedActionService: ActionService = params.mockedActionService ?? createActionServiceMock()
  const mockedRundownEventObserver: RundownEventObserver = params.mockedRundownEventObserver ?? createRundownEventObserverMock()

  return new MiniShelfStateService(instance(mockedActionService), instance(mockedRundownEventObserver))
}

function createMinimalTesteeCycleMiniShelfBackward(): MiniShelfStateService {
  const mockedActionService: ActionService = mock<ActionService>()
  when(mockedActionService.executeAction('mockedSegment3Id', 'mockedRundownId')).thenResolve()
  const actionService: ActionService = instance(mockedActionService)
  const mockedRundownEventObserver: RundownEventObserver = mock<RundownEventObserver>()

  const mockedPartTakenEvent: PartTakenEvent = mock<PartTakenEvent>()
  when(mockedPartTakenEvent.rundownId).thenReturn('mockedRundownId')
  when(mockedPartTakenEvent.segmentId).thenReturn('mockedSegment3Id')
  const partTakenEvent: PartTakenEvent = instance(mockedPartTakenEvent)
  when(mockedRundownEventObserver.subscribeToRundownTake(anything())).thenCall(value => value(partTakenEvent))
  const rundownEventObserver: RundownEventObserver = instance(mockedRundownEventObserver)

  const testee: MiniShelfStateService = createMinimalTestee({ mockedActionService: actionService, mockedRundownEventObserver: rundownEventObserver })

  // segment OnAir
  const mockedSegment0: Segment = mock<Segment>()
  const segment0: Segment = instance(mockedSegment0)
  when(mockedSegment0.id).thenReturn('mockedSegment0Id')
  when(mockedSegment0.isHidden).thenReturn(false)
  when(mockedSegment0.isOnAir).thenReturn(true)

  // three MiniShelves
  const mockedSegment1: Segment = mock<Segment>()
  const segment1: Segment = instance(mockedSegment1)
  const mockTv2Segment1Metadata: Tv2SegmentMetadata = mock<Tv2SegmentMetadata>()
  const tv2Segment1Metadata: Tv2SegmentMetadata = instance(mockTv2Segment1Metadata)
  when(mockedSegment1.id).thenReturn('mockedSegment1Id')
  when(mockedSegment1.metadata).thenReturn(tv2Segment1Metadata)
  when(mockedSegment1.isHidden).thenReturn(true)

  const mockedSegment2: Segment = mock<Segment>()
  const segment2: Segment = instance(mockedSegment2)
  const mockTv2Segment2Metadata: Tv2SegmentMetadata = mock<Tv2SegmentMetadata>()
  const tv2Segment2Metadata: Tv2SegmentMetadata = instance(mockTv2Segment2Metadata)
  when(mockedSegment2.id).thenReturn('mockedSegment2Id')
  when(mockedSegment2.metadata).thenReturn(tv2Segment2Metadata)
  when(mockedSegment2.isHidden).thenReturn(true)

  const mockedSegment3: Segment = mock<Segment>()
  const segment3: Segment = instance(mockedSegment3)
  const mockTv2Segment3Metadata: Tv2SegmentMetadata = mock<Tv2SegmentMetadata>()
  const tv2Segment3Metadata: Tv2SegmentMetadata = instance(mockTv2Segment3Metadata)
  when(mockedSegment3.id).thenReturn('mockedSegment3Id')
  when(mockedSegment3.metadata).thenReturn(tv2Segment3Metadata)
  when(mockedSegment3.isHidden).thenReturn(true)

  // normal segment as Next
  const mockedSegment4: Segment = mock<Segment>()
  const segment4: Segment = instance(mockedSegment4)
  when(mockedSegment4.id).thenReturn('mockedSegment4Id')
  when(mockedSegment4.isHidden).thenReturn(false)
  when(mockedSegment4.isNext).thenReturn(true)

  const mockedRundown: Rundown = mock<Rundown>()
  when(mockedRundown.id).thenReturn('mockedRundownId')
  const rundown: Rundown = instance(mockedRundown)
  when(mockedRundown.segments).thenReturn([segment0, segment1, segment2, segment3, segment4])

  const mockedSegment1Tv2VideoClipAction: Tv2VideoClipAction = mock<Tv2VideoClipAction>()
  const segment1Tv2VideoClipAction: Tv2VideoClipAction = instance(mockedSegment1Tv2VideoClipAction)
  when(mockedSegment1Tv2VideoClipAction.metadata).thenReturn({ contentType: Tv2ActionContentType.VIDEO_CLIP, fileName: 'fileName1' })
  const mockedSegment2Tv2VideoClipAction: Tv2VideoClipAction = mock<Tv2VideoClipAction>()
  const segment2Tv2VideoClipAction: Tv2VideoClipAction = instance(mockedSegment2Tv2VideoClipAction)
  when(mockedSegment2Tv2VideoClipAction.metadata).thenReturn({ contentType: Tv2ActionContentType.VIDEO_CLIP, fileName: 'fileName2' })
  const mockedSegment3Tv2VideoClipAction: Tv2VideoClipAction = mock<Tv2VideoClipAction>()
  const segment3Tv2VideoClipAction: Tv2VideoClipAction = instance(mockedSegment3Tv2VideoClipAction)
  when(mockedSegment3Tv2VideoClipAction.metadata).thenReturn({ contentType: Tv2ActionContentType.VIDEO_CLIP, fileName: 'fileName3' })
  testee.updateMiniShelves(rundown)
  testee.setActions({
    mockedSegment1Id: segment1Tv2VideoClipAction,
    mockedSegment2Id: segment2Tv2VideoClipAction,
    mockedSegment3Id: segment3Tv2VideoClipAction,
  })
  testee['activeSegmentId'] = 'mockedSegment0Id'
  testee['activeRundownId'] = 'mockedRundownId'

  return testee
}

function createMinimalTesteeMiniShelfGroups(): MiniShelfStateService {
  const testee: MiniShelfStateService = createMinimalTestee()
  const mockedRundown: Rundown = mock<Rundown>()
  const mockedSegment1: Segment = mock<Segment>()
  when(mockedSegment1.id).thenReturn('mockedSegment1Id')
  when(mockedSegment1.isHidden).thenReturn(false)
  const mockedSegment2: Segment = mock<Segment>()
  const mockTv2Segment2Metadata: Tv2SegmentMetadata = mock<Tv2SegmentMetadata>()
  const tv2Segment2Metadata: Tv2SegmentMetadata = instance(mockTv2Segment2Metadata)
  when(mockedSegment2.id).thenReturn('mockedSegment2Id')
  when(mockedSegment2.metadata).thenReturn(tv2Segment2Metadata)
  when(mockedSegment2.isHidden).thenReturn(true)
  const mockedSegment3: Segment = mock<Segment>()
  when(mockedSegment3.id).thenReturn('mockedSegment3Id')
  when(mockedSegment3.isHidden).thenReturn(false)
  when(mockedRundown.segments).thenReturn([instance(mockedSegment1), instance(mockedSegment2), instance(mockedSegment3)])
  testee.updateMiniShelves(instance(mockedRundown))
  return testee
}

function createMinimalTesteeCycleMiniShelfAny(): MiniShelfStateService {
  const testee: MiniShelfStateService = createMinimalTestee()
  testee['activeSegmentId'] = 'mockedSegmentId'
  testee['activeRundownId'] = 'mockedRundownId'
  const mockedRundown: Rundown = mock<Rundown>()
  const mockedSegment: Segment = mock<Segment>()
  const mockTv2SegmentMetadata: Tv2SegmentMetadata = mock<Tv2SegmentMetadata>()
  const tv2SegmentMetadata: Tv2SegmentMetadata = instance(mockTv2SegmentMetadata)
  when(mockedSegment.id).thenReturn('mockedSegmentId')
  when(mockedSegment.metadata).thenReturn(tv2SegmentMetadata)
  when(mockedSegment.isHidden).thenReturn(true)
  when(mockedRundown.segments).thenReturn([instance(mockedSegment)])
  const aRunDown: Rundown = instance(mockedRundown)
  const mockedTv2VideoClipAction: Tv2VideoClipAction = mock<Tv2VideoClipAction>()
  const tv2VideoClipAction: Tv2VideoClipAction = instance(mockedTv2VideoClipAction)
  when(mockedTv2VideoClipAction.metadata).thenReturn({ contentType: Tv2ActionContentType.VIDEO_CLIP, fileName: 'fileName' })
  const actionMap: Record<string, Tv2VideoClipAction> = { mockedSegmentId: tv2VideoClipAction }
  testee.setActions(actionMap)
  testee.updateMiniShelves(aRunDown)
  return testee
}
