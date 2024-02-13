import { Component, ElementRef, Input, OnChanges, SimpleChange, SimpleChanges, ViewChild } from '@angular/core'
import { HoverScrubElementSize, VideoHoverScrubPositonsAndMoment } from '../hover-scrub/hover-scrub.component'
import { Tv2PieceType } from 'src/app/core/enums/tv2-piece-type'
import { PieceLifespan } from 'src/app/core/models/piece-lifespan'
import { IconButton, IconButtonSize } from 'src/app/shared/enums/icon-button'

@Component({
  selector: 'sofie-unavailable-video-hover-scrub',
  templateUrl: './unavailable-video-hover-scrub.component.html',
  styleUrls: ['./unavailable-video-hover-scrub.component.scss'],
})
export class UnavailableVideoHoverScrubComponent implements OnChanges {
  @Input() public fileName: string
  @Input() public type: Tv2PieceType
  @Input() public hoverScrubElementSize: HoverScrubElementSize
  @Input() public videoHoverScrubPositonsAndMoment: VideoHoverScrubPositonsAndMoment
  @Input() public pieceLifespan?: PieceLifespan
  @Input() public hoverScrubTooltipElemen: HTMLElement

  protected readonly IconButton = IconButton
  protected readonly IconButtonSize = IconButtonSize

  public readonly videoContainerWidth = 160
  public currentVideoTimeInS: number
  public videoDurationInS: number
  private isVideoContentAppended: boolean = false

  @ViewChild('tooltipElementRef')
  public tooltipElementRef: ElementRef<HTMLVideoElement>

  public ngOnChanges(changes: SimpleChanges): void {
    const videoHoverScrubPositonsAndMomentChange: SimpleChange | undefined = changes['videoHoverScrubPositonsAndMoment']
    if (!videoHoverScrubPositonsAndMomentChange) {
      return
    }
    if (this.tooltipElementRef && !this.isVideoContentAppended) {
      this.appendVideoContentToHoverScrubTooltip()
    }
  }

  private appendVideoContentToHoverScrubTooltip(): void {
    this.isVideoContentAppended = true
    this.hoverScrubTooltipElemen.appendChild(this.tooltipElementRef.nativeElement)
  }

  public getTranlationForPieceLifespan(): string {
    switch (this.pieceLifespan) {
      case PieceLifespan.WITHIN_PART:
        return $localize`rundown-overview.piece-lifespan.within-part.label`
      case PieceLifespan.SPANNING_UNTIL_RUNDOWN_END:
        return $localize`rundown-overview.piece-lifespan.spanning-until-rundown-end.label`
      case PieceLifespan.SPANNING_UNTIL_SEGMENT_END:
        return $localize`rundown-overview.piece-lifespan.spanning-until-segment-end.label`
      case PieceLifespan.START_SPANNING_SEGMENT_THEN_STICKY_RUNDOWN:
        return $localize`rundown-overview.piece-lifespan.start-spanning-segment-then-sticky-rundown.label`
      case PieceLifespan.STICKY_UNTIL_RUNDOWN_CHANGE:
        return $localize`rundown-overview.piece-lifespan.sticky-until-rundown-change.label`
      case PieceLifespan.STICKY_UNTIL_SEGMENT_CHANGE:
        return $localize`rundown-overview.piece-lifespan.sticky-until-segment-change.label`
      default:
        return ''
    }
  }
}
