import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { Rundown } from '../../../core/models/rundown'
import { Segment } from '../../../core/models/segment'
import { RundownTimingContextStateService } from '../../../core/services/rundown-timing-context-state.service'
import { Logger } from '../../../core/abstractions/logger.service'
import { Part } from '../../../core/models/part'
import { RundownTimingContext } from '../../../core/models/rundown-timing-context'
import { Subscription } from 'rxjs'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { ActionStateService } from '../../../shared/services/action-state.service'
import { Action } from '../../../shared/models/action'
import { Tv2Action, Tv2ActionContentType, Tv2VideoClipAction } from '../../../shared/models/tv2-action'

@Component({
  selector: 'sofie-rundown',
  templateUrl: './rundown.component.html',
  styleUrls: ['./rundown.component.scss'],
})
export class RundownComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  public rundown: Rundown

  public currentEpochTime: number = Date.now()
  public remainingDurationInMsForOnAirPart?: number
  public startOffsetsInMsFromPlayheadForSegments: Record<string, number> = {}
  private rundownTimingContextSubscription?: Subscription
  private readonly logger: Logger
  private actions: Action[] = []
  private miniShelfSegments: Segment[] = []
  protected actionMap: Record<string, Tv2VideoClipAction> = {}

  constructor(
    private readonly rundownTimingContextStateService: RundownTimingContextStateService,
    private readonly partEntityService: PartEntityService,
    private readonly actionStateService: ActionStateService,
    logger: Logger
  ) {
    this.logger = logger.tag('RundownComponent')
  }

  public ngOnInit(): void {
    this.rundownTimingContextStateService
      .subscribeToRundownTimingContext(this.rundown.id)
      .then(rundownTimingContextObservable => rundownTimingContextObservable.subscribe(this.onRundownTimingContextChanged.bind(this)))
      .then(rundownTimingContextSubscription => (this.rundownTimingContextSubscription = rundownTimingContextSubscription))
      .catch(error => this.logger.data(error).error('Failed subscribing to rundown timing context changes.'))
    void this.actionStateService
      .subscribeToRundownActions(this.rundown.id)
      .then(actionsObservable => actionsObservable.subscribe(this.onActionsChanged.bind(this)))
  }

  private onActionsChanged(actions: Action[]): void {
    this.actions = actions
    this.mapActionsToMiniShelfSegments()
  }
  public ngOnChanges(changes: SimpleChanges): void {
    if ('rundown' in changes) {
      this.findAllMiniShelfSegments()
      this.mapActionsToMiniShelfSegments()
    }
  }

  private onRundownTimingContextChanged(rundownTimingContext: RundownTimingContext): void {
    this.currentEpochTime = rundownTimingContext.currentEpochTime
    const onAirPart: Part | undefined = this.rundown.segments.find(segment => segment.isOnAir)?.parts.find(part => part.isOnAir)

    this.remainingDurationInMsForOnAirPart = onAirPart ? this.partEntityService.getExpectedDuration(onAirPart) - rundownTimingContext.playedDurationInMsForOnAirPart : undefined
    this.startOffsetsInMsFromPlayheadForSegments = this.getStartOffsetsInMsFromPlayheadForSegments(rundownTimingContext)
  }

  private getStartOffsetsInMsFromPlayheadForSegments(rundownTimingContext: RundownTimingContext): Record<string, number> {
    const remainingDurationInMsForOnAirSegment = this.getRemainingDurationInMsForOnAirPart(rundownTimingContext)
    return Object.fromEntries(
      Object.entries<number>(rundownTimingContext.startOffsetsInMsFromNextCursorForSegments).map(([segmentId, startOffsetInMs]) => [segmentId, startOffsetInMs + remainingDurationInMsForOnAirSegment])
    )
  }

  private getRemainingDurationInMsForOnAirPart(rundownTimingContext: RundownTimingContext): number {
    if (!rundownTimingContext.onAirSegmentId) {
      return 0
    }
    const expectedDurationInMsForOnAirSegment: number = rundownTimingContext.expectedDurationsInMsForSegments[rundownTimingContext.onAirSegmentId] ?? 0
    return Math.max(0, expectedDurationInMsForOnAirSegment - rundownTimingContext.playedDurationInMsForOnAirSegment)
  }

  public ngOnDestroy(): void {
    this.rundownTimingContextSubscription?.unsubscribe()
  }

  public trackSegment(_: number, segment: Segment): string {
    return segment.id
  }

  private findAllMiniShelfSegments(): void {
    this.miniShelfSegments = this.rundown.segments.filter(segment => segment.metadata?.miniShelfVideoClipFile)
  }

  private mapActionsToMiniShelfSegments(): void {
    this.actionMap = {}
    let videoClipActions: Tv2VideoClipAction[] = this.actions.filter((action): action is Tv2VideoClipAction => {
      // TODO - should use validator to check if the action is a TV2Action
      return (<Tv2Action>action).metadata?.contentType === Tv2ActionContentType.VIDEO_CLIP
    })

    console.log('videoClipActions', videoClipActions)
    this.miniShelfSegments.forEach(segment => {
      let videoClipFile: string | undefined = segment.metadata?.miniShelfVideoClipFile
      if (videoClipFile == undefined) {
        return
      }
      let action: Tv2VideoClipAction | undefined = videoClipActions.find(action => {
        return action.metadata?.sourceName === videoClipFile
      })
      if (action == undefined) {
        return
      }
      this.actionMap[segment.id] = action
    })
  }
}
