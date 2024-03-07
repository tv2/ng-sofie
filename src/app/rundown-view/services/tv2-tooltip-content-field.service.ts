import { Injectable } from '@angular/core'
import { Tv2Piece } from '../../core/models/tv2-piece'
import { Tv2PieceType } from '../../core/enums/tv2-piece-type'
import { TooltipContentField } from '../../shared/abstractions/tooltip-content-field'
import { Tv2OutputLayer } from '../../core/models/tv2-output-layer'
import { Piece } from '../../core/models/piece'
import { Media } from '../../shared/services/media'
import { TimerPipe } from '../../shared/pipes/timer/timer.pipe'

const TOOLTIP_TIME_FORMAT: string = 'HH?:mm:ss'
@Injectable()
export class Tv2TooltipContentFieldService {
  constructor(private readonly timerPipe: TimerPipe) {}

  public getTooltipContentForPiece(piece: Piece, media: Media | undefined, partDuration: number): TooltipContentField[] {
    const tv2Piece: Tv2Piece = piece as Tv2Piece
    switch (tv2Piece.metadata.type) {
      case Tv2PieceType.VIDEO_CLIP:
        return [
          { label: 'Name of clip', data: tv2Piece.name },
          { label: 'Duration', data: '' + this.timerPipe.transform(partDuration, TOOLTIP_TIME_FORMAT) ?? 'Unknown' },
          { label: 'Available for playout', data: media ? 'Yes' : 'No' },
        ]
      case Tv2PieceType.JINGLE:
        return [
          { label: 'Name of clip', data: tv2Piece.name },
          { label: 'Duration', data: '' + this.timerPipe.transform(partDuration, TOOLTIP_TIME_FORMAT) ?? 'Unknown' },
          { label: 'Available for playout', data: media ? 'Yes' : 'No' },
        ]
      case Tv2PieceType.AUDIO:
        return [
          { label: 'Name', data: tv2Piece.name },
          { label: 'Timecode in part', data: tv2Piece.duration ? this.getTimecodeStringForPiece(tv2Piece, TOOLTIP_TIME_FORMAT) : '(No specific timecode)' },
        ]
      case Tv2PieceType.COMMAND:
        return [
          { label: 'Name', data: tv2Piece.name },
          { label: 'Timecode in part', data: tv2Piece.duration ? this.getTimecodeStringForPiece(tv2Piece, TOOLTIP_TIME_FORMAT) : '(No specific timecode)' },
        ]
      case Tv2PieceType.GRAPHICS:
        return this.getGraphicsTooltipContentFields(tv2Piece, media)
      case Tv2PieceType.OVERLAY_GRAPHICS:
        return [
          { label: 'Name', data: tv2Piece.name },
          { label: 'Out type', data: tv2Piece.lifespan.replace(/_/g, ' ') },
        ]
      default:
        return []
    }
  }

  private getTimecodeStringForPiece(piece: Tv2Piece, timeFormat: string): string {
    const startTime: number = Math.round(piece.start / 1000) * 1000
    const startTimeString: string = this.timerPipe.transform(startTime, 'HH?:mm:ss')
    const endTime: number = piece.start + (piece.duration ?? 0)
    const endTimeString: string = this.timerPipe.transform(endTime, timeFormat)
    return `${startTimeString} - ${endTimeString}`
  }

  // TODO: Differ between "O"verlay Show" and "Overlay VCP"
  private getGraphicsTooltipContentFields(tv2Piece: Tv2Piece, media: Media | undefined): TooltipContentField[] {
    const tooltipTimeFormat: string = 'HH?:mm:ss'
    if (tv2Piece.metadata.outputLayer === Tv2OutputLayer.PROGRAM) {
      return [
        { label: 'Name', data: tv2Piece.name },
        { label: 'Available for playout', data: media ? 'Yes' : 'No' },
      ]
    } else if (tv2Piece.metadata.outputLayer === Tv2OutputLayer.OVERLAY) {
      return [
        { label: 'Name', data: tv2Piece.name },
        { label: 'Timecode in part', data: tv2Piece.duration ? this.getTimecodeStringForPiece(tv2Piece, tooltipTimeFormat) : '(No specific timecode)' },
        { label: 'Out type', data: tv2Piece.lifespan.replace(/_/g, ' ') },
      ]
    }
    return []
  }
}
