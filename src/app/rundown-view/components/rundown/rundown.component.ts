import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
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
  private videoClipActions: Tv2VideoClipAction[] = []
  private miniShelfSegments: Segment[] = []
  protected miniShelfSegmentActionMappings: Record<string, Tv2VideoClipAction> = {}
  private rundownActionsSubscription: Subscription

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
    this.actionStateService
      .subscribeToRundownActions(this.rundown.id)
      .then(rundownActionsObservable => rundownActionsObservable.subscribe(this.onActionsChanged.bind(this)))
      .then(rundownActionsSubscription => (this.rundownActionsSubscription = rundownActionsSubscription))
      .catch(error => this.logger.data(error).error('Failed subscribing to rundown actions changes.'))
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
  }

  private miniShelfSegmentsReducer(actionMap: Record<string, Tv2VideoClipAction>, segment: Segment): Record<string, Tv2VideoClipAction> {
    const videoClipFile: string | undefined = segment.metadata?.miniShelfVideoClipFile
    if (!videoClipFile) return actionMap

    const action: Tv2VideoClipAction | undefined = this.videoClipActions.find(action => action.metadata?.fileName === videoClipFile)

    return action ? { ...actionMap, [segment.id]: action } : actionMap
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Tab':
        this.cycleMiniShelves(event.shiftKey || event.altKey ? CycleDirection.PREVIOUS : CycleDirection.NEXT)
        event.preventDefault()
        break
    }
  }

  private cycleMiniShelves(direction: number): void {
    const segmentOnAir: Segment | undefined = this.rundown.segments.find(segment => !segment.isHidden && segment.isOnAir)
    // console.info('segmentOnAir', segmentOnAir)
    if (!segmentOnAir) {
      this.logger.debug('No running Segment found')
      return
    }

    // now we have a running segment, and it might be a MiniShelf so should be included
    // also no need to remember where we are in the rundown
    const miniShelves: Segment[] = this.rundown.segments
      // what is bellow in the rundown is our field of interest: bellowSegments group [segmentOnAir, ...]
      .filter(segment => this.rundown.segments.indexOf(segment) >= this.rundown.segments.indexOf(segmentOnAir))
      // just exposed ones
      .filter(segment => !segment.isHidden)
      // extract the MiniShelves only
      .filter(segment => segment.metadata?.miniShelfVideoClipFile)
    // console.info('miniShelves', miniShelves)
    if (miniShelves.length === 0) {
      this.logger.debug('No MiniShelves found bellow the running Segment')
      return
    }

    let nextAction = this.miniShelfSegmentActionMappings[miniShelves[0].id]
    // console.info('nextAction', nextAction)
    if (!nextAction) {
      this.logger.debug('No next action found for MiniShelf')
      return
    }
    if (miniShelves.length >= 2 && direction == CycleDirection.PREVIOUS) {
      nextAction = this.miniShelfSegmentActionMappings[miniShelves[miniShelves.length - 1].id]
      // TODO - or perhaps should break the group of MiniShelves when in between is a Segment
    }

    if (!nextAction) {
      this.logger.debug('No next action found for MiniShelf')
      return
    }
    // console.info('nextAction', nextAction)
    this.actionStateService.executeAction(nextAction.id, this.rundown.id)
  }
}
export enum CycleDirection {
  PREVIOUS = -1,
  NEXT = 1,
}
