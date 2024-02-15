import { Injectable } from '@angular/core'
import { Segment } from '../../core/models/segment'
import { ActionService } from '../../shared/abstractions/action.service'
import { Tv2Action, Tv2ActionContentType, Tv2VideoClipAction } from '../../shared/models/tv2-action'
import { MiniShelfNavigationService } from './mini-shelf-navigation.service'
import { Rundown } from '../../core/models/rundown'
import { ActionStateService } from '../../shared/services/action-state.service'
import { Action } from '../../shared/models/action'

@Injectable()
export class MiniShelfCycleService {
  constructor(
    private readonly miniShelfNavigationService: MiniShelfNavigationService,
    private readonly actionStateService: ActionStateService,
    private readonly actionService: ActionService
  ) {}

  public cycleMiniShelfForward(rundown: Rundown): void {
    const rundownActions: Tv2Action[] = this.actionStateService.getRundownActions(rundown.id) as Tv2Action[]
    const nextMiniShelfSegment: Segment = this.miniShelfNavigationService.getNextMiniShelfSegment(rundown, rundownActions)
    const nextMiniShelfAction: Action = this.getActionForMiniShelfSegment(nextMiniShelfSegment, rundownActions)
    this.actionService.executeAction(nextMiniShelfAction.id, rundown.id).subscribe()
  }

  private getActionForMiniShelfSegment(segment: Segment, rundownActions: Tv2Action[]): Action {
    const videoClipFilename: string | undefined = segment.metadata?.miniShelfVideoClipFile
    if (!videoClipFilename) {
      throw new Error('Unable to extract video clip filename.')
    }
    const videoClipAction: Action | undefined = rundownActions.find(
      action => action.metadata.contentType === Tv2ActionContentType.VIDEO_CLIP && (action as Tv2VideoClipAction).metadata.fileName === videoClipFilename
    )
    if (!videoClipAction) {
      throw new Error('Unable to find video clip action.')
    }
    return videoClipAction
  }

  public cycleMiniShelfBackward(rundown: Rundown): void {
    const rundownActions: Tv2Action[] = this.actionStateService.getRundownActions(rundown.id) as Tv2Action[]
    const nextMiniShelfSegment: Segment = this.miniShelfNavigationService.getPreviousMiniShelfSegment(rundown, rundownActions)
    const nextMiniShelfAction: Action = this.getActionForMiniShelfSegment(nextMiniShelfSegment, rundownActions)
    this.actionService.executeAction(nextMiniShelfAction.id, rundown.id).subscribe()
  }
}
