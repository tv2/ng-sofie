import { Injectable } from '@angular/core'
import { Rundown } from '../../core/models/rundown'
import { Segment } from '../../core/models/segment'
import { ActionService } from '../../shared/abstractions/action.service'
import { RundownEventObserver } from '../../core/services/rundown-event-observer.service'
import { PartTakenEvent, RundownActivatedEvent } from '../../core/models/rundown-event'
import { Tv2VideoClipAction } from '../../shared/models/tv2-action'

@Injectable()
export class MiniShelfStateService {
  private readonly miniShelfGroups: Map<string[], Segment[]> = new Map()
  private miniShelfSegmentActionMappings: Record<string, Tv2VideoClipAction> = {}
  private activeSegmentId: string = ''
  private activeRundownId: string = ''
  private currentMiniShelfIndex: number = 0
  private lastExecutedMiniShelfGroup: Segment[] = []

  constructor(
    private readonly actionService: ActionService,
    private readonly rundownEventObserver: RundownEventObserver
  ) {
    this.rundownEventObserver.subscribeToRundownActivation((rundownActivatedEvent: RundownActivatedEvent) => {
      this.activeRundownId = rundownActivatedEvent.rundownId
    })
    this.rundownEventObserver.subscribeToRundownTake((partTakenEvent: PartTakenEvent) => {
      this.activeSegmentId = partTakenEvent.segmentId
    })
  }

  public updateMiniShelves(rundown: Rundown): void {
    this.activeSegmentId = rundown.segments.find(segment => segment.isOnAir)?.id || ''
    this.activeRundownId = rundown.isActive ? rundown.id : ''
    this.miniShelfGroups.clear()
    let miniShelfGroupId: string[] = []
    let miniShelfSegmentsForGroup: Segment[] = []

    for (let i = 0; i < rundown.segments.length; i++) {
      const currentSegment: Segment = rundown.segments[i]
      const isCurrentSegmentMiniShelf: boolean = this.isMiniShelf(currentSegment)
      const isNextSegmentMiniShelf: boolean = i === rundown.segments.length - 1 ? false : this.isMiniShelf(rundown.segments[i + 1])

      miniShelfGroupId.push(currentSegment.id)
      if (isCurrentSegmentMiniShelf) {
        miniShelfSegmentsForGroup.push(currentSegment)
      }

      if (isCurrentSegmentMiniShelf && !isNextSegmentMiniShelf) {
        // End of a miniShelf group
        this.miniShelfGroups.set(miniShelfGroupId, miniShelfSegmentsForGroup)
        miniShelfGroupId = []
        miniShelfSegmentsForGroup = []
      }
    }
  }

  private isMiniShelf(segment: Segment): boolean {
    return !!segment.metadata?.miniShelfVideoClipFile && segment.isHidden
  }

  public setActions(miniShelfSegmentActionMappings: Record<string, Tv2VideoClipAction>): void {
    this.miniShelfSegmentActionMappings = miniShelfSegmentActionMappings
  }

  private executeVideoClipActionForSegment(segment: Segment): void {
    const action: Tv2VideoClipAction = this.miniShelfSegmentActionMappings[segment.id]
    if (!action) {
      return
    }
    this.actionService.executeAction(action.id, this.activeRundownId).subscribe()
  }

  public cycleMiniShelfBackward(): void {
    const miniShelfGroup: Segment[] = this.findMiniShelfGroup()
    if (miniShelfGroup.length === 0) {
      return
    }
    if (miniShelfGroup !== this.lastExecutedMiniShelfGroup) {
      this.lastExecutedMiniShelfGroup = miniShelfGroup
      this.currentMiniShelfIndex = miniShelfGroup.length - 1
    } else {
      this.currentMiniShelfIndex = this.currentMiniShelfIndex <= 0 ? miniShelfGroup.length - 1 : this.currentMiniShelfIndex - 1
    }
    this.executeVideoClipActionForSegment(miniShelfGroup[this.currentMiniShelfIndex])
  }

  public cycleMiniShelfForward(): void {
    const miniShelfGroup: Segment[] = this.findMiniShelfGroup()
    if (miniShelfGroup.length === 0) {
      return
    }
    if (miniShelfGroup !== this.lastExecutedMiniShelfGroup) {
      this.lastExecutedMiniShelfGroup = miniShelfGroup
      this.currentMiniShelfIndex = 0
    } else {
      this.currentMiniShelfIndex = this.currentMiniShelfIndex >= miniShelfGroup.length - 1 ? 0 : this.currentMiniShelfIndex + 1
    }
    this.executeVideoClipActionForSegment(miniShelfGroup[this.currentMiniShelfIndex])
  }

  private findMiniShelfGroup(): Segment[] {
    if (!this.activeSegmentId) {
      return []
    }
    const key: string[] | undefined = Array.from(this.miniShelfGroups.keys()).find(key => key.includes(this.activeSegmentId))
    if (!key) {
      return []
    }
    const miniShelfGroup: Segment[] | undefined = this.miniShelfGroups.get(key)
    if (!miniShelfGroup) {
      return []
    }
    return miniShelfGroup
  }
}
