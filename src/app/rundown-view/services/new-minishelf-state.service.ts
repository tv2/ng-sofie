import { Injectable, OnDestroy } from '@angular/core'
import { Rundown } from '../../core/models/rundown'
import { Subscription } from 'rxjs'
import { Logger } from '../../core/abstractions/logger.service'
import { Tv2VideoClipAction } from '../../shared/models/tv2-action'
import { Segment } from '../../core/models/segment'
import { RundownStateService } from '../../core/services/rundown-state.service'
import { ActivatedRoute } from '@angular/router'

@Injectable()
export class NewMiniShelfStateService implements OnDestroy {
  // Mini Shelf State Service is responsible for merging action and media data with MiniShelf segments and expose them via observables.
  private rundown: Rundown
  private rundownSubscription: Subscription
  private readonly logger: Logger
  private miniShelfSegmentActionMappings: Record<string, Tv2VideoClipAction>
  private readonly videoClipActions: Tv2VideoClipAction[]
  private miniShelfSegments: Segment[]
  constructor(
    // private readonly actionService: ActionService,

    // subscribes to media from MediaStateService
    // private readonly mediaStateService: MediaStateService,

    // subscribes to rundowns from RundownStateService
    private readonly rundownStateService: RundownStateService,

    // subscribes to actions from ActionStateService
    // private readonly actionStateService: ActionStateService,

    // gets the current rundownId from ActivatedRoute
    private readonly route: ActivatedRoute,
    logger: Logger
  ) {
    this.logger = logger.tag('NewMiniShelfStateService')

    const rundownId: string | null = this.route.snapshot.paramMap.get('rundownId')
    if (!rundownId) {
      this.logger.error("No rundownId found. Can't fetch Rundown")
      return
    }
    this.rundownStateService
      .subscribeToRundown(rundownId)
      .then(rundownObservable => rundownObservable.subscribe(this.setRundown.bind(this)))
      .then(rundownSubscription => (this.rundownSubscription = rundownSubscription))
      .catch(error => this.logger.data(error).error(`Failed subscribing to rundown with id '${rundownId}'.`))
  }

  private miniShelfSegmentsReducer(actionMap: Record<string, Tv2VideoClipAction>, segment: Segment): Record<string, Tv2VideoClipAction> {
    const videoClipFile: string | undefined = segment.metadata?.miniShelfVideoClipFile
    if (!videoClipFile) return actionMap

    const action: Tv2VideoClipAction | undefined = this.videoClipActions.find(action => {
      return action.metadata?.fileName === videoClipFile && action.name === segment.name
    })

    return action ? { ...actionMap, [segment.id]: action } : actionMap
  }

  public ngOnDestroy(): void {
    this.rundownSubscription?.unsubscribe()
  }

  private setRundown(rundown: Rundown | undefined): void {
    console.log('setRundown', rundown)
    if (!rundown) {
      return
    }
    this.rundown = rundown
    this.miniShelfSegments = this.rundown.segments.filter(segment => segment.metadata?.miniShelfVideoClipFile)
    this.miniShelfSegmentActionMappings = this.miniShelfSegments.reduce(this.miniShelfSegmentsReducer.bind(this), {})
  }

  public getVideoClipAction(miniShelf: Segment): Tv2VideoClipAction {
    console.log(miniShelf)
    return this.miniShelfSegmentActionMappings[miniShelf.id]
  }
}
