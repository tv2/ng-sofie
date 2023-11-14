import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core'
import { Rundown } from '../../../core/models/rundown'
import { Piece } from '../../../core/models/piece'
import { Tv2PieceMetadata } from '../../../core/models/tv2-piece'
import { Tv2PieceType } from '../../../core/enums/tv2-piece-type'
import { Part } from '../../../core/models/part'

@Component({
  selector: 'sofie-rundown-subheader',
  templateUrl: './rundown-subheader.component.html',
  styleUrls: ['./rundown-subheader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RundownSubheaderComponent implements OnChanges {
  @Input()
  public rundown: Rundown

  public endWords?: string

  public ngOnChanges(changes: SimpleChanges): void {
    const rundownChange: SimpleChange | undefined = changes['rundown']
    if (rundownChange) {
      this.setEndWords()
    }
  }

  private setEndWords(): void {
    this.endWords = this.rundown.segments
      .find(segment => segment.isOnAir)
      ?.parts.find(part => part.isOnAir && this.doesPartContainVideoClipPiece(part))
      ?.pieces.find(piece => this.isManusPiece(piece))?.name
  }

  private doesPartContainVideoClipPiece(part: Part): boolean {
    return part.pieces.some(piece => this.isVideoClipPiece(piece))
  }

  private isVideoClipPiece(piece: Piece): boolean {
    const pieceMetadata: Tv2PieceMetadata | undefined = piece.metadata as Tv2PieceMetadata | undefined
    return pieceMetadata?.type === Tv2PieceType.VIDEO_CLIP
  }

  private isManusPiece(piece: Piece): boolean {
    const pieceMetadata: Tv2PieceMetadata | undefined = piece.metadata as Tv2PieceMetadata | undefined
    return pieceMetadata?.type === Tv2PieceType.MANUS
  }
}
