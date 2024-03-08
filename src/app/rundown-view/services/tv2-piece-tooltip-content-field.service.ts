import { Injectable } from '@angular/core'
import { Tv2Piece } from '../../core/models/tv2-piece'
import { Tv2PieceType } from '../../core/enums/tv2-piece-type'
import { TooltipContentField } from '../../shared/abstractions/tooltip-content-field'
import { Tv2OutputLayer } from '../../core/models/tv2-output-layer'
import { Piece } from '../../core/models/piece'
import { Media } from '../../shared/services/media'
import { TimerPipe } from '../../shared/pipes/timer/timer.pipe'
import { PieceLifespan } from '../../core/models/piece-lifespan'

const NAME_LABEL: string = $localize`piece-tooltip-content.name.label`
const NAME_OF_CLIP_LABEL: string = $localize`piece-tooltip-content.name-of-clip.label`
const NAME_OF_PILOT_ELEMENT: string = $localize`piece-tooltip-content.name-of-pilot.label`
const TEMPLATE_NAME_LABEL: string = $localize`piece-tooltip-content.template-name.label`

const CONTENT_OF_ALL_FIELDS_LABEL: string = $localize`piece-tooltip-content.content-of-all-fields.label`
const DURATION_LABEL: string = $localize`piece-tooltip-content.duration.label`
const AVAILABLE_FOR_PLAYOUT_LABEL: string = $localize`piece-tooltip-content.available-for-playout.label`
const TIME_CODE_IN_PART_LABEL: string = $localize`piece-tooltip-content.time-code-in-part.label`
const OUT_TYPE_LABEL: string = $localize`piece-tooltip-content.out-type.label`

const UNKNOWN_DATA: string = $localize`piece-tooltip-content.unknown.data`
const NO_SPECIFIC_TIME_CODE_DATA: string = $localize`piece-tooltip-content.no-specific-time-code.data`

const YES_LABEL: string = $localize`global.yes`
const NO_LABEL: string = $localize`global.no`

const TOOLTIP_TIME_FORMAT: string = 'HH?:mm:ss'

@Injectable()
export class Tv2PieceTooltipContentFieldService {
  constructor(private readonly timerPipe: TimerPipe) {}

  public getTooltipContentForPiece(piece: Piece, media: Media | undefined, partDuration: number): TooltipContentField[] {
    const tv2Piece: Tv2Piece = piece as Tv2Piece
    switch (tv2Piece.metadata.type) {
      case Tv2PieceType.VIDEO_CLIP:
        return [
          { label: NAME_OF_CLIP_LABEL, data: tv2Piece.name },
          { label: DURATION_LABEL, data: '' + this.timerPipe.transform(partDuration, TOOLTIP_TIME_FORMAT) ?? UNKNOWN_DATA },
          { label: AVAILABLE_FOR_PLAYOUT_LABEL, data: media ? YES_LABEL : NO_LABEL },
        ]
      case Tv2PieceType.JINGLE:
        return [
          { label: NAME_OF_CLIP_LABEL, data: tv2Piece.name },
          { label: DURATION_LABEL, data: '' + this.timerPipe.transform(partDuration, TOOLTIP_TIME_FORMAT) ?? UNKNOWN_DATA },
          { label: AVAILABLE_FOR_PLAYOUT_LABEL, data: media ? YES_LABEL : NO_LABEL },
        ]
      case Tv2PieceType.AUDIO:
        return [
          { label: NAME_LABEL, data: tv2Piece.name },
          { label: TIME_CODE_IN_PART_LABEL, data: tv2Piece.duration ? this.getTimeCodeStringForPiece(tv2Piece, TOOLTIP_TIME_FORMAT) : NO_SPECIFIC_TIME_CODE_DATA },
        ]
      case Tv2PieceType.COMMAND:
        return [
          { label: NAME_LABEL, data: tv2Piece.name },
          { label: TIME_CODE_IN_PART_LABEL, data: tv2Piece.duration ? this.getTimeCodeStringForPiece(tv2Piece, TOOLTIP_TIME_FORMAT) : NO_SPECIFIC_TIME_CODE_DATA },
        ]
      case Tv2PieceType.GRAPHICS:
        return this.getGraphicsTooltipContentFields(tv2Piece, media)
      case Tv2PieceType.OVERLAY_GRAPHICS:
        return [
          { label: NAME_OF_PILOT_ELEMENT, data: tv2Piece.name },
          { label: AVAILABLE_FOR_PLAYOUT_LABEL, data: media ? YES_LABEL : NO_LABEL },
        ]
      default:
        return []
    }
  }

  private getTimeCodeStringForPiece(piece: Tv2Piece, timeFormat: string): string {
    const startTime: number = Math.round(piece.start / 1000) * 1000
    const startTimeString: string = this.timerPipe.transform(startTime, 'HH?:mm:ss')
    const endTime: number = piece.start + (piece.duration ?? 0)
    const endTimeString: string = this.timerPipe.transform(endTime, timeFormat)
    return `${startTimeString} - ${endTimeString}`
  }

  private getGraphicsTooltipContentFields(tv2Piece: Tv2Piece, media: Media | undefined): TooltipContentField[] {
    if (tv2Piece.metadata.outputLayer === Tv2OutputLayer.PROGRAM) {
      return [
        { label: NAME_OF_PILOT_ELEMENT, data: tv2Piece.name },
        { label: AVAILABLE_FOR_PLAYOUT_LABEL, data: media ? YES_LABEL : NO_LABEL },
      ]
    } else if (tv2Piece.metadata.outputLayer === Tv2OutputLayer.OVERLAY && this.hasAssociatedMedia(tv2Piece)) {
      return [
        { label: NAME_OF_PILOT_ELEMENT, data: tv2Piece.name },
        { label: TIME_CODE_IN_PART_LABEL, data: tv2Piece.duration ? this.getTimeCodeStringForPiece(tv2Piece, TOOLTIP_TIME_FORMAT) : NO_SPECIFIC_TIME_CODE_DATA },
        { label: OUT_TYPE_LABEL, data: tv2Piece.lifespan.replace(/_/g, ' ') },
        { label: AVAILABLE_FOR_PLAYOUT_LABEL, data: media ? YES_LABEL : NO_LABEL },
      ]
    }
    return [
      { label: CONTENT_OF_ALL_FIELDS_LABEL, data: tv2Piece.name },
      { label: TEMPLATE_NAME_LABEL, data: tv2Piece.metadata.graphicTemplateName ?? UNKNOWN_DATA },
      { label: TIME_CODE_IN_PART_LABEL, data: tv2Piece.duration ? this.getTimeCodeStringForPiece(tv2Piece, TOOLTIP_TIME_FORMAT) : NO_SPECIFIC_TIME_CODE_DATA },
      { label: OUT_TYPE_LABEL, data: this.getPieceLifespanLabel(tv2Piece.lifespan) },
    ]
  }

  private getPieceLifespanLabel(lifespan: PieceLifespan): string {
    switch (lifespan) {
      case PieceLifespan.WITHIN_PART:
        return $localize`piece.lifespan.within-part`
      case PieceLifespan.STICKY_UNTIL_SEGMENT_CHANGE:
        return $localize`piece.lifespan.sticky-until-segment-change`
      case PieceLifespan.SPANNING_UNTIL_SEGMENT_END:
        return $localize`piece.lifespan.sticky-until-segment-end`
      case PieceLifespan.STICKY_UNTIL_RUNDOWN_CHANGE:
        return $localize`piece.lifespan.sticky-until-rundown-change`
      case PieceLifespan.SPANNING_UNTIL_RUNDOWN_END:
        return $localize`piece.lifespan.spanning-until-rundown-end`
      case PieceLifespan.START_SPANNING_SEGMENT_THEN_STICKY_RUNDOWN:
        return $localize`piece.lifespan.start-spanning-segment-then-sticky-rundown`
      default:
        return $localize`piece.lifespan.unknown`
    }
  }

  private hasAssociatedMedia(tv2Piece: Tv2Piece): boolean {
    return !!tv2Piece.metadata.sourceName
  }
}
