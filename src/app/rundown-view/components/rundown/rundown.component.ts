import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { Rundown } from '../../../core/models/rundown'
import { Segment } from '../../../core/models/segment'
import { RundownTimingContextStateService } from '../../../core/services/rundown-timing-context-state.service'
import { Logger } from '../../../core/abstractions/logger.service'
import { Part } from '../../../core/models/part'
import { RundownTimingContext } from '../../../core/models/rundown-timing-context'
import { Subscription } from 'rxjs'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { RundownEventObserver } from 'src/app/core/services/rundown-event-observer.service'
import { EventSubscription } from 'src/app/event-system/abstractions/event-observer.service'
import { ActionStateService } from '../../../shared/services/action-state.service'
import { Action } from '../../../shared/models/action'
import { Tv2Action, Tv2ActionContentType, Tv2VideoClipAction } from '../../../shared/models/tv2-action'
import { MiniShelfStateService } from '../../services/mini-shelf-state.service'

@Component({
  selector: 'sofie-rundown',
  templateUrl: './rundown.component.html',
  styleUrls: ['./rundown.component.scss'],
})
export class RundownComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  public rundown: Rundown
  public isAutoNextStarted: boolean = false
  public currentEpochTime: number = Date.now()
  public remainingDurationInMsForOnAirPart?: number
  public startOffsetsInMsFromPlayheadForSegments: Record<string, number> = {}
  private rundownTimingContextSubscription?: Subscription
  private readonly logger: Logger
  private readonly rundownEventSubscriptions: EventSubscription[] = []
  private videoClipActions: Tv2VideoClipAction[] = []
  private miniShelfSegments: Segment[] = []
  protected miniShelfSegmentActionMappings: Record<string, Tv2VideoClipAction> = {}
  private rundownActionsSubscription: Subscription

  constructor(
    private readonly rundownTimingContextStateService: RundownTimingContextStateService,
    private readonly partEntityService: PartEntityService,
    private readonly rundownEventObserver: RundownEventObserver,
    private readonly actionStateService: ActionStateService,
    private readonly miniShelfStateService: MiniShelfStateService,
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
    this.actionStateService
      .subscribeToRundownActions(this.rundown.id)
      .then(rundownActionsObservable => rundownActionsObservable.subscribe(this.onActionsChanged.bind(this)))
      .then(rundownActionsSubscription => (this.rundownActionsSubscription = rundownActionsSubscription))
      .catch(error => this.logger.data(error).error('Failed subscribing to rundown actions changes.'))

    this.subscribeForEventObserver()
    this.miniShelfStateService.updateMiniShelves(this.rundown)
  }

  private subscribeForEventObserver(): void {
    this.rundownEventSubscriptions.push(this.rundownEventObserver.subscribeToRundownAutoNext(this.setAutoNextStartedToTrue.bind(this)))
    this.rundownEventSubscriptions.push(this.rundownEventObserver.subscribeToRundownSetNext(this.setAutoNextStartedToFalse.bind(this)))
    this.rundownEventSubscriptions.push(this.rundownEventObserver.subscribeToRundownReset(this.setAutoNextStartedToFalse.bind(this)))
    this.rundownEventSubscriptions.push(this.rundownEventObserver.subscribeToRundownDeactivation(this.setAutoNextStartedToFalse.bind(this)))
  }

  private setAutoNextStartedToTrue(): void {
    this.isAutoNextStarted = true
  }

  private setAutoNextStartedToFalse(): void {
    this.isAutoNextStarted = false
  }

  private onRundownTimingContextChanged(rundownTimingContext: RundownTimingContext): void {
    this.currentEpochTime = rundownTimingContext.currentEpochTime
    const onAirPart: Part | undefined = this.rundown.segments.find(segment => segment.isOnAir)?.parts.find(part => part.isOnAir)

    this.remainingDurationInMsForOnAirPart = onAirPart ? this.partEntityService.getExpectedDuration(onAirPart) - rundownTimingContext.playedDurationInMsForOnAirPart : undefined
    this.startOffsetsInMsFromPlayheadForSegments = this.getStartOffsetsInMsFromPlayheadForSegments(rundownTimingContext)
  }

  private onActionsChanged(actions: Action[]): void {
    this.videoClipActions = actions.filter((action): action is Tv2VideoClipAction => (action as Tv2Action).metadata?.contentType === Tv2ActionContentType.VIDEO_CLIP)
    this.updateMiniShelfSegmentActionMappings()
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.logger.data(changes).debug('RundownComponent ngOnChanges')
    if ('rundown' in changes) {
      this.updateMiniShelfSegments()
      this.updateMiniShelfSegmentActionMappings()
    }
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
    this.rundownEventSubscriptions.forEach(subscription => subscription.unsubscribe)
    this.rundownActionsSubscription?.unsubscribe()
  }

  public trackSegment(_: number, segment: Segment): string {
    return segment.id
  }

  private updateMiniShelfSegments(): void {
    this.miniShelfSegments = this.rundown.segments.filter(segment => segment.metadata?.miniShelfVideoClipFile)
  }

  private updateMiniShelfSegmentActionMappings(): void {
    this.miniShelfSegmentActionMappings = this.miniShelfSegments.reduce(this.miniShelfSegmentsReducer.bind(this), {})
    this.miniShelfStateService.setActions(this.miniShelfSegmentActionMappings)
  }

  private miniShelfSegmentsReducer(actionMap: Record<string, Tv2VideoClipAction>, segment: Segment): Record<string, Tv2VideoClipAction> {
    const videoClipFile: string | undefined = segment.metadata?.miniShelfVideoClipFile
    if (!videoClipFile) return actionMap

    const action: Tv2VideoClipAction | undefined = this.videoClipActions.find(action => {
      // return action.metadata?.fileName === videoClipFile && action.name === segment.name
      return action.metadata?.fileName === videoClipFile
    })

    return action ? { ...actionMap, [segment.id]: action } : actionMap
  }

  protected miniShelfStateServicegetActiveSegmentId(id: string): boolean {
    return this.miniShelfStateService.getActiveSegmentId() === id
  }

  protected miniShelfStateServicegetNextSegmentId(id: string): boolean {
    return this.miniShelfStateService.getNextSegmentId() === id
  }
}
