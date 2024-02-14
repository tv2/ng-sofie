import { Injectable, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { Segment } from '../../core/models/segment'
import { ActionService } from '../../shared/abstractions/action.service'
import { Tv2VideoClipAction } from '../../shared/models/tv2-action'
import { NewMiniShelfStateService } from './new-minishelf-state.service'
import { MiniShelfNavigationService } from './minishelf-navigation.service'

@Injectable()
export class MiniShelfCycleService implements OnDestroy {
  // Mini Shelf Cycle Service[Service]Is the mediator that can be called to orchestrate the cycling and the execution of it
  private cycleSubscription: Subscription
  private currentMiniShelf: Segment
  constructor(
    // subscribes to mini shelf data from NewMiniShelfStateService
    private readonly newMiniShelfStateService: NewMiniShelfStateService,
    // asks for next/prev mini shelf from MiniShelfNavigationService
    private readonly miniShelfNavigationService: MiniShelfNavigationService,
    // executes the mini shelf action via ActionService
    private readonly actionService: ActionService
  ) {}

  public cycleMiniShelfForward(): void {
    const nextMiniShelf: Segment = this.miniShelfNavigationService.getNextMiniShelf(this.currentMiniShelf)
    console.log(nextMiniShelf)
    this.cycleSubscription = this.getActionAndExecute(nextMiniShelf)
  }

  public cycleMiniShelfBackward(): void {
    this.cycleSubscription = this.getActionAndExecute(this.miniShelfNavigationService.getPreviousMiniShelf(this.currentMiniShelf))
  }

  private getActionAndExecute(miniShelf: Segment): Subscription {
    if (!miniShelf) {
      return Subscription.EMPTY
    }
    const videoClipAction: Tv2VideoClipAction = this.newMiniShelfStateService.getVideoClipAction(miniShelf)
    this.currentMiniShelf = miniShelf
    return this.actionService.executeAction(videoClipAction?.id, miniShelf?.rundownId).subscribe()
  }

  public ngOnDestroy(): void {
    this.cycleSubscription?.unsubscribe()
  }
}
