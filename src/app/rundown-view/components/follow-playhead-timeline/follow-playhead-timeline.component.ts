import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core'
import { Part } from '../../../core/models/part'
import { Segment } from '../../../core/models/segment'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { Tv2OutputLayer } from '../../../core/models/tv2-output-layer'
import { SegmentEntityService } from '../../../core/services/models/segment-entity.service'

const PRE_PLAYHEAD_INSET_IN_PIXELS: number = 40 * 4
const POST_PLAYHEAD_INSET_IN_PIXELS: number = 200

@Component({
  selector: 'sofie-follow-playhead-timeline',
  templateUrl: './follow-playhead-timeline.component.html',
  styleUrls: ['./follow-playhead-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowPlayheadTimelineComponent implements OnChanges {
  @Input()
  public time: number

  @Input()
  public segment: Segment

  @Input()
  public outputLayers: Tv2OutputLayer[]

  @Input()
  public isRundownActive: boolean

  public pixelsPerSecond: number = 50

  public onAirPart?: Part
  public previousParts: Part[] = []
  public futureParts: Part[] = []

  public prePlayheadDurationInMs: number = (PRE_PLAYHEAD_INSET_IN_PIXELS * 1000) / this.pixelsPerSecond
  public postPlayheadDurationInMs: number = (POST_PLAYHEAD_INSET_IN_PIXELS * 1000) / this.pixelsPerSecond

  constructor(
    private readonly segmentEntityService: SegmentEntityService,
    private readonly partEntityService: PartEntityService,
    private readonly rundownService: RundownService
  ) {}

  public setPartAsNext(part: Part): void {
    this.rundownService.setNext(this.segment.rundownId, part.segmentId, part.id).subscribe()
  }

  public ngOnChanges(): void {
    const onAirPartIndex: number = this.segment.parts.findIndex(part => part.isOnAir)
    if (onAirPartIndex < 0) {
      return
    }
    this.onAirPart = this.segment.parts[onAirPartIndex]
    this.previousParts = this.getPreviousParts(onAirPartIndex)
    this.futureParts = this.getFutureParts(onAirPartIndex)
  }

  private getPreviousParts(onAirPartIndex: number): Part[] {
    return this.segment.parts.slice(0, onAirPartIndex).filter(part => this.isPreviousPartVisible(part))
  }

  private isPreviousPartVisible(part: Part): boolean {
    const partEndOffsetInMs: number = this.segmentEntityService.getPartEndOffsetInMs(this.segment, part.id)
    return partEndOffsetInMs >= this.time - this.prePlayheadDurationInMs
  }

  private getFutureParts(onAirPartIndex: number): Part[] {
    return this.segment.parts.slice(onAirPartIndex + 1)
  }

  public getOnAirPartOffsetInMs(): number {
    if (!this.onAirPart) {
      return 0
    }
    const playedDurationInMsForPart: number = Date.now() - this.onAirPart.executedAt
    return playedDurationInMsForPart - this.prePlayheadDurationInMs
  }

  public getPreviousPartOffsetInMs(part: Part): number {
    const duration: number = part.playedDuration ? part.playedDuration : this.partEntityService.getDuration(part)
    const viewportDurationInMs: number = this.getViewportDurationInMsForPreviousPart(part)
    return Math.max(0, duration - viewportDurationInMs)
  }

  private getViewportDurationInMsForPreviousPart(previousPart: Part): number {
    const partEndTimeInMs: number = this.segmentEntityService.getPartEndOffsetInMs(this.segment, previousPart.id)
    const durationSinceTakenOffAirInMs: number = Math.min(this.prePlayheadDurationInMs, this.time - partEndTimeInMs)
    return this.prePlayheadDurationInMs - durationSinceTakenOffAirInMs
  }

  public trackPart(_: number, part: Part): string {
    return part.id
  }
}
