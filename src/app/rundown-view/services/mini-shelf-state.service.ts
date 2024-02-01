import { Injectable } from '@angular/core'
import { Rundown } from '../../core/models/rundown'
import { Segment } from '../../core/models/segment'
import { ActionService } from '../../shared/abstractions/action.service'
import { RundownEventObserver } from '../../core/services/rundown-event-observer.service'
import { PartTakenEvent } from '../../core/models/rundown-event'
import { Tv2VideoClipAction } from '../../shared/models/tv2-action'

@Injectable()
export class MiniShelfStateService {
  private readonly miniShelfGroups: Map<string[], Segment[]> = new Map()
  private miniShelfSegmentActionMappings: Record<string, Tv2VideoClipAction> = {}
  private activeSegmentId: string
  private activeRundownId: string

  constructor(
    private readonly rundownEventObserver: RundownEventObserver,
    private readonly actionService: ActionService
  ) {
    rundownEventObserver.subscribeToRundownTake((partTakenEvent: PartTakenEvent) => {
      this.activeSegmentId = partTakenEvent.segmentId
      this.activeRundownId = partTakenEvent.rundownId
    })
  }

  public setMiniShelves(rundown: Rundown): void {
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

    console.log(this.miniShelfGroups)
  }

  private isMiniShelf(segment: Segment): boolean {
    return !!segment.metadata?.miniShelfVideoClipFile && segment.isHidden
  }

  public setActions(miniShelfSegmentActionMappings: Record<string, Tv2VideoClipAction>): void {
    this.miniShelfSegmentActionMappings = miniShelfSegmentActionMappings
  }

  public cycleMiniShelf(): void {
    debugger
    const key: string[] | undefined = Array.from(this.miniShelfGroups.keys()).find(key => key.includes(this.activeSegmentId))
    if (!key) {
      console.log(`No MiniShelfGroup found for Segment ${this.activeSegmentId}`)
      return
    }
    const miniShelfGroup: Segment[] | undefined = this.miniShelfGroups.get(key)
    if (!miniShelfGroup) {
      console.log(`No Group found for key ${key}`)
      return
    }
    const miniShelf: Segment = miniShelfGroup[0]
    const action: Tv2VideoClipAction = this.miniShelfSegmentActionMappings[miniShelf.id]
    this.actionService.executeAction(action.id, this.activeRundownId).subscribe()
  }
}
