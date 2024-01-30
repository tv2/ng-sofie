import { Component, Input, OnDestroy, OnInit } from '@angular/core'
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

@Component({
  selector: 'sofie-rundown',
  templateUrl: './rundown.component.html',
  styleUrls: ['./rundown.component.scss'],
})
export class RundownComponent implements OnInit, OnDestroy {
  @Input()
  public rundown: Rundown
  public isAutoNextStarted: boolean = false
  public currentEpochTime: number = Date.now()
  public remainingDurationInMsForOnAirPart?: number
  public startOffsetsInMsFromPlayheadForSegments: Record<string, number> = {}
  private rundownTimingContextSubscription?: Subscription
  private readonly logger: Logger
  private readonly rundownEventSubscriptions: EventSubscription[] = []

  constructor(
    private readonly rundownTimingContextStateService: RundownTimingContextStateService,
    private readonly partEntityService: PartEntityService,
    private readonly rundownEventObserver: RundownEventObserver,
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
    this.subscribeForEventObserver()
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
  }

  public trackSegment(_: number, segment: Segment): string {
    return segment.id
  }
}
