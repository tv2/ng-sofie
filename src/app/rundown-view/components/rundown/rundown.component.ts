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
  private segmentOnAir: Segment | undefined = undefined
  private partOnAir: Part | undefined = undefined
  private segmentOnAirIndex: number = -1 // -1 means no Segment On-Air was found
  private currentMiniShelfIndex: number = -1 // -1 means no MiniShelf cycling was performed

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
    this.segmentOnAir = this.rundown.segments.find(segment => segment.isOnAir)
    if (this.segmentOnAir) {
      this.segmentOnAirIndex = this.rundown.segments.indexOf(this.segmentOnAir)
    }
    this.partOnAir = this.segmentOnAir?.parts.find(part => part.isOnAir)

    this.remainingDurationInMsForOnAirPart = this.partOnAir ? this.partEntityService.getExpectedDuration(this.partOnAir) - rundownTimingContext.playedDurationInMsForOnAirPart : undefined
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

  private shouldCycleMiniShelves(): boolean {
    if (!this.segmentOnAir) {
      this.logger.debug('No Segment On-Air found')
      return false
    }
    if (this.segmentOnAirIndex < 0) {
      this.logger.debug('No Segment On-Air index found')
      return false
    }
    if (!this.partOnAir) {
      this.logger.debug('No Part On-Air found')
      return false
    }
    return true
  }
  private cycleMiniShelves(direction: number): void {
    if (!this.shouldCycleMiniShelves()) {
      return
    }

    const miniShelves: Segment[] = this.rundown.segments
      // look bellow the segment OnAir
      .filter(segment => this.rundown.segments.indexOf(segment) >= this.segmentOnAirIndex)
      // and find all MiniShelves
      .filter(segment => this.isMiniShelfSegment(segment))
    if (miniShelves.length === 0) {
      this.logger.debug('No MiniShelves found bellow the running Segment')
      return
    }

    // this is the very first time we do cycle, and we should honor initially the direction
    if (this.currentMiniShelfIndex < 0 && direction === CycleDirection.PREVIOUS) {
      this.currentMiniShelfIndex = 0 // and re-adjust the default value
    }

    // calculate
    let miniShelfIndex = this.currentMiniShelfIndex + direction
    // and wrap
    if (miniShelfIndex < 0) {
      miniShelfIndex = miniShelves.length - 1
    } else if (miniShelfIndex >= miniShelves.length) {
      miniShelfIndex = 0
    }

    const nextAction: Tv2VideoClipAction = this.miniShelfSegmentActionMappings[miniShelves[miniShelfIndex].id]
    if (!nextAction) {
      this.logger.debug('No next action found for MiniShelf')
      return
    }

    // finally set and execute
    this.currentMiniShelfIndex = miniShelfIndex
    this.actionStateService.executeAction(nextAction.id, this.rundown.id)
  }

  public isMiniShelfSegment(segment: Segment): boolean {
    return <boolean>(segment.metadata?.miniShelfVideoClipFile && segment.isHidden)
  }
}
export enum CycleDirection {
  PREVIOUS = -1,
  NEXT = 1,
}
