import { MiniShelfStateService } from './mini-shelf-state.service'
import { instance, mock } from '@typestrong/ts-mockito'
import { RundownEventObserver } from '../../core/services/rundown-event-observer.service'
import { ActionService } from '../../shared/abstractions/action.service'
import { Tv2VideoClipAction } from '../../shared/models/tv2-action'

function setupTestee(): { testee: MiniShelfStateService; mockedActionService: ActionService; mockedRundownEventObserver: RundownEventObserver } {
  const mockedActionService: ActionService = mock<ActionService>()
  const actionService: ActionService = instance(mockedActionService)
  const mockedRundownEventObserver: RundownEventObserver = mock<RundownEventObserver>()
  const rundownEventObserver: RundownEventObserver = instance(mockedRundownEventObserver)

  const testee: MiniShelfStateService = new MiniShelfStateService(actionService, rundownEventObserver)
  return { testee, mockedActionService, mockedRundownEventObserver }
}
describe(MiniShelfStateService.name, (): void => {
  it('should create', (): void => {
    const { testee } = setupTestee()
    expect(testee).toBeTruthy()
  })

  describe(MiniShelfStateService.prototype.setActions.name, (): void => {
    it('should be defined', (): void => {
      const { testee } = setupTestee()
      expect(testee.setActions).toBeDefined()
    })
    it('should set the miniShelfSegmentActionMappings', (): void => {
      const { testee } = setupTestee()
      const mockedTv2VideoClipAction1: Tv2VideoClipAction = mock<Tv2VideoClipAction>()
      const tv2VideoClipAction1: Tv2VideoClipAction = instance(mockedTv2VideoClipAction1)
      const mockedTv2VideoClipAction2: Tv2VideoClipAction = mock<Tv2VideoClipAction>()
      const tv2VideoClipAction2: Tv2VideoClipAction = instance(mockedTv2VideoClipAction2)
      const mockedTv2VideoClipAction3: Tv2VideoClipAction = mock<Tv2VideoClipAction>()
      const tv2VideoClipAction3: Tv2VideoClipAction = instance(mockedTv2VideoClipAction3)
      testee.setActions({ '1': tv2VideoClipAction1, '2': tv2VideoClipAction2, '3': tv2VideoClipAction3 })
      expect(testee['miniShelfSegmentActionMappings']).toEqual({ '1': tv2VideoClipAction1, '2': tv2VideoClipAction2, '3': tv2VideoClipAction3 })
    })
  })

  describe(MiniShelfStateService.prototype.updateMiniShelves.name, (): void => {
    it('should be defined', (): void => {
      const { testee } = setupTestee()
      expect(testee.updateMiniShelves).toBeDefined()
    })
  })

  describe(MiniShelfStateService.prototype.executeVideoClipActionForSegment.name, (): void => {
    it('should be defined', (): void => {
      const { testee } = setupTestee()
      expect(testee.executeVideoClipActionForSegment).toBeDefined()
    })
  })

  describe(MiniShelfStateService.prototype.cycleMiniShelfForward.name, (): void => {
    it('should be defined', (): void => {
      const { testee } = setupTestee()
      expect(testee.cycleMiniShelfForward).toBeDefined()
    })
  })

  describe(MiniShelfStateService.prototype.cycleMiniShelfBackward.name, (): void => {
    it('should be defined', (): void => {
      const { testee } = setupTestee()
      expect(testee.cycleMiniShelfBackward).toBeDefined()
    })
  })

  describe(MiniShelfStateService.prototype.findMiniShelfGroup.name, (): void => {
    it('should be defined', (): void => {
      const { testee } = setupTestee()
      expect(testee.findMiniShelfGroup).toBeDefined()
    })
  })

  describe(MiniShelfStateService.prototype.getActiveSegmentId.name, (): void => {
    it('should be defined', (): void => {
      const { testee } = setupTestee()
      expect(testee.getActiveSegmentId).toBeDefined()
    })
  })

  describe(MiniShelfStateService.prototype.getNextSegmentId.name, (): void => {
    it('should be defined', (): void => {
      const { testee } = setupTestee()
      expect(testee.getNextSegmentId).toBeDefined()
    })
  })
})
