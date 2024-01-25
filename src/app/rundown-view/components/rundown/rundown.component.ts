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
import { ActionService } from '../../../shared/abstractions/action.service'

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

  @HostListener('document:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Tab2':
        this.cycleMiniShelf2(event.shiftKey || event.altKey ? -1 : 1)
        event.preventDefault()
        break
      case 'Tab':
        this.cycleMiniShelf(event.shiftKey || event.altKey ? -1 : 1)
        event.preventDefault()
        break
    }
  }

  constructor(
    private readonly rundownTimingContextStateService: RundownTimingContextStateService,
    private readonly partEntityService: PartEntityService,
    private readonly actionService: ActionService,
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
    this.videoClipActions = actions.filter((action): action is Tv2VideoClipAction => {
      return action && (<Tv2Action>action).metadata?.contentType === Tv2ActionContentType.VIDEO_CLIP
    })
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

    const action: Tv2VideoClipAction | undefined = this.videoClipActions.find(action => {
      return action.metadata?.fileName === videoClipFile
    })

    return action ? { ...actionMap, [segment.id]: action } : actionMap
  }

  private cycleMiniShelf2(direction: number): void {
    const segmentIds: string[] = Object.keys(this.miniShelfSegmentActionMappings)
    console.log(segmentIds)
    const currentSegmentId: string | undefined = this.rundown.segments.find(segment => segment.isOnAir)?.id
    console.log(currentSegmentId)
    const currentSegmentIndex: number = currentSegmentId ? segmentIds.indexOf(currentSegmentId) : -1
    console.log(currentSegmentIndex)
    const nextSegmentIndex: number = (currentSegmentIndex + direction + segmentIds.length) % segmentIds.length
    console.log(nextSegmentIndex)
    const nextSegmentId: string = segmentIds[nextSegmentIndex]
    console.log(nextSegmentId)
    const nextSegment: Segment | undefined = this.rundown.segments.find(segment => segment.id === nextSegmentId)
    console.log(nextSegment)
    const nextAction: Tv2VideoClipAction | undefined = nextSegment ? this.miniShelfSegmentActionMappings[nextSegment.id] : undefined
    console.log(nextAction)
    if (!nextAction) return
    console.log(`${nextAction.id}, ${this.rundown.id}`)
    this.actionService.executeAction(nextAction.id, this.rundown.id).subscribe()
  }

  private cycleMiniShelf(direction: number): void {
    const segmentOnAir: Segment | undefined = this.rundown.segments.find(segment => segment.metadata?.miniShelfVideoClipFile && !segment.isHidden)
    if (!segmentOnAir) return
    const segmentOnAirIndex: number = this.miniShelfSegments.indexOf(segmentOnAir)
    const nextSegmentIndex: number = (segmentOnAirIndex + direction + this.miniShelfSegments.length) % this.miniShelfSegments.length
    const nextSegment: Segment = this.miniShelfSegments[nextSegmentIndex]
    const nextAction: Tv2VideoClipAction | undefined = this.miniShelfSegmentActionMappings[nextSegment.id]
    if (!nextAction) return
    this.actionService.executeAction(nextAction.id, this.rundown.id).subscribe()
  }
}
