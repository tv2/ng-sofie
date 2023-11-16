import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Rundown } from '../../../core/models/rundown'
import { Segment } from '../../../core/models/segment'
import { RundownTimingContextStateService } from '../../../core/services/rundown-timing-context-state.service'
import { Logger } from '../../../core/abstractions/logger.service'
import { Part } from '../../../core/models/part'
import { RundownTimingContext } from '../../../core/models/rundown-timing-context'
import { Tv2PieceType } from '../../../core/enums/tv2-piece-type'
import { Tv2PieceMetadata } from '../../../core/models/tv2-piece'
import { Subscription } from 'rxjs'
import { PartEntityService } from '../../../core/services/models/part-entity.service'

@Component({
  selector: 'sofie-rundown',
  templateUrl: './rundown.component.html',
  styleUrls: ['./rundown.component.scss'],
})
export class RundownComponent implements OnInit, OnDestroy {
  @Input()
  public rundown: Rundown

  public remainingDurationInMsForOnAirPart?: number
  private rundownTimingContextSubscription?: Subscription
  private readonly logger: Logger

  public constructor(
    private readonly rundownTimingContextStateService: RundownTimingContextStateService,
    private readonly partEntityService: PartEntityService,
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
  }

  private onRundownTimingContextChanged(rundownTimingContext: RundownTimingContext): void {
    const onAirPart: Part | undefined = this.rundown.segments.find(segment => segment.isOnAir)?.parts.find(part => part.isOnAir)

    if (!onAirPart || !this.doesPartContainVideoClipOrVoiceOver(onAirPart)) {
      this.remainingDurationInMsForOnAirPart = undefined
    } else {
      this.remainingDurationInMsForOnAirPart = rundownTimingContext.playedDurationInMsForOnAirPart - this.partEntityService.getExpectedDuration(onAirPart)
    }
  }

  private doesPartContainVideoClipOrVoiceOver(part: Part): boolean {
    const supportedPieceTypes: (string | undefined)[] = [Tv2PieceType.VIDEO_CLIP, Tv2PieceType.VOICE_OVER]
    return part.pieces.some(piece =>
      supportedPieceTypes.includes((piece.metadata as Tv2PieceMetadata | undefined)?.type)
    ) ?? false
  }

  public ngOnDestroy(): void {
    this.rundownTimingContextSubscription?.unsubscribe()
  }

  public trackSegment(_: number, segment: Segment): string {
    return segment.id
  }
}
