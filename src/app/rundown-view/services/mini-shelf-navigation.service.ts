import { Injectable } from '@angular/core'
import { Segment } from '../../core/models/segment'
import { Rundown } from '../../core/models/rundown'
import { Part } from '../../core/models/part'
import { Tv2Part } from '../../core/models/tv2-part'
import { Tv2Action, Tv2ActionContentType, Tv2VideoClipAction } from '../../shared/models/tv2-action'

@Injectable()
export class MiniShelfNavigationService {
  public getNextMiniShelfSegment(rundown: Rundown, rundownActions: Tv2Action[]): Segment {
    const currentActionId: string | undefined = this.getCurrentMiniShelfActionId(rundown)
    const miniShelfSegmentGroup: Segment[] = this.getNearestMiniShelfSegmentGroupBeneathOnAirSegment(rundown)
    const currentMiniShelfSegmentIndex: number = currentActionId ? this.getCurrentMiniShelfSegmentIndexFromActionId(currentActionId, miniShelfSegmentGroup, rundownActions) : -1

    const nextMiniShelfSegmentIndex: number = (currentMiniShelfSegmentIndex + 1) % miniShelfSegmentGroup.length
    return miniShelfSegmentGroup[nextMiniShelfSegmentIndex]
  }

  private getCurrentMiniShelfActionId(rundown: Rundown): string | undefined {
    const onAirPart: Tv2Part = this.getOnAirPart(rundown)
    const nextPart: Tv2Part = this.getNextPart(rundown)
    return nextPart?.metadata?.actionId ?? onAirPart.metadata?.actionId
  }

  private getOnAirPart(rundown: Rundown): Tv2Part {
    const nextPart: Part | undefined = rundown.segments.find(segment => segment.isOnAir)?.parts.find(part => part.isOnAir)

    if (!nextPart) {
      throw new Error('Unable to to find next part.')
    }
    return nextPart as Tv2Part
  }

  private getNextPart(rundown: Rundown): Tv2Part {
    const nextPart: Part | undefined = rundown.segments.find(segment => segment.isNext)?.parts.find(part => part.isNext)

    if (!nextPart) {
      throw new Error('Unable to to find next part.')
    }
    return nextPart as Tv2Part
  }

  private getNearestMiniShelfSegmentGroupBeneathOnAirSegment(rundown: Rundown): Segment[] {
    const onAirSegmentIndex: number = rundown.segments.findIndex(segment => segment.isOnAir)
    if (onAirSegmentIndex < 0) {
      throw new Error('Unable to find on air segment.')
    }
    const firstMiniShelfIndex: number = rundown.segments.findIndex((segment, index) => index > onAirSegmentIndex && this.isMiniShelf(segment))
    if (firstMiniShelfIndex < 0) {
      throw new Error('Unable to find mini shelf.')
    }
    const maybeLastMiniShelfIndex: number = rundown.segments.findIndex((segment, index) => index > firstMiniShelfIndex && !this.isMiniShelf(segment))
    const lastMiniShelfIndex: number = maybeLastMiniShelfIndex < 0 ? rundown.segments.length : maybeLastMiniShelfIndex
    return rundown.segments.slice(firstMiniShelfIndex, lastMiniShelfIndex)
  }

  private isMiniShelf(segment: Segment): boolean {
    return !!segment.metadata?.miniShelfVideoClipFile && segment.isHidden
  }

  private getCurrentMiniShelfSegmentIndexFromActionId(actionId: string, miniShelfSegmentGroup: Segment[], rundownActions: Tv2Action[]): number {
    const videoClipAction: Tv2VideoClipAction | undefined = rundownActions.find(
      (action): action is Tv2VideoClipAction => action.metadata.contentType === Tv2ActionContentType.VIDEO_CLIP && action.id === actionId
    )
    if (!videoClipAction) {
      return -1
    }
    return miniShelfSegmentGroup.findIndex(segment => segment.metadata?.miniShelfVideoClipFile === videoClipAction.metadata.fileName)
  }

  public getPreviousMiniShelfSegment(rundown: Rundown, rundownActions: Tv2Action[]): Segment {
    const currentActionId: string | undefined = this.getCurrentMiniShelfActionId(rundown)
    const miniShelfSegmentGroup: Segment[] = this.getNearestMiniShelfSegmentGroupBeneathOnAirSegment(rundown)
    const currentMiniShelfSegmentIndex: number = currentActionId
      ? this.getCurrentMiniShelfSegmentIndexFromActionId(currentActionId, miniShelfSegmentGroup, rundownActions)
      : miniShelfSegmentGroup.length

    const nextMiniShelfSegmentIndex: number = (miniShelfSegmentGroup.length + currentMiniShelfSegmentIndex - 1) % miniShelfSegmentGroup.length
    return miniShelfSegmentGroup[nextMiniShelfSegmentIndex]
  }
}
