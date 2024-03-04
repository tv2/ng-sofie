import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, SimpleChange, SimpleChanges, ViewChild } from '@angular/core'
import { Piece } from '../../../core/models/piece'
import { Tv2Piece } from '../../../core/models/tv2-piece'
import { Tv2OutputLayer } from '../../../core/models/tv2-output-layer'

@Component({
  selector: 'sofie-offsetable-stack',
  templateUrl: './offsetable-stack.component.html',
  styleUrls: ['./offsetable-stack.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffsetableStackComponent implements OnChanges {
  @Input() public piecesFromOutputLayerAndStartKey: Tv2Piece[]
  @Input() public outputLayer: Tv2OutputLayer
  @Input() public startKey: string

  @ViewChild('stackPieces') protected stackPieces: ElementRef<HTMLDivElement>

  protected readonly Object = Object

  protected pieceStack: Tv2PieceStack = {
    start: 0,
    duration: 0,
    pieces: [],
    piecesNames: [],
    stacks: {},
    stackKeys: [],
  }

  constructor() {}

  public ngOnChanges(changes: SimpleChanges): void {
    const piecesForStackChange: SimpleChange | undefined = changes['piecesForStack']
    if (piecesForStackChange && piecesForStackChange.currentValue?.length > 0) {
      this.pieceStack = this.createPieceStack(piecesForStackChange.currentValue)
    }
  }

  private createPieceStack(pieces: Piece[]): Tv2PieceStack {
    const stacker = new Tv2PieceStacker()
    pieces.forEach(piece => stacker.stackPiece(piece as Tv2Piece))
    return stacker.getPieceStack()
  }

  public toggleStackPieces(): void {
    if (!this.stackPieces) {
      return
    }
    if (this.stackPieces.nativeElement.classList.contains('hidden')) {
      this.stackPieces.nativeElement.classList.replace('hidden', 'stack-pieces')
    } else {
      this.stackPieces.nativeElement.classList.replace('stack-pieces', 'hidden')
    }
  }
}

export interface Tv2PieceDataInTranzit {
  pixelsPerSecond: number
  prePlayheadDurationInMs: number
  postPlayheadDurationInMs: number
}

export interface Tv2PieceStack {
  start: number
  duration: number
  pieces: Tv2Piece[]
  piecesNames: string[]
  stacks: Record<number, Tv2Piece[]>
  stackKeys: number[]
}

class Tv2PieceStacker {
  private pieceStack: Tv2PieceStack = {
    start: Number.MAX_SAFE_INTEGER,
    duration: 0,
    pieces: [],
    piecesNames: [],
    stacks: {},
    stackKeys: [],
  }
  constructor() {}

  public stackPiece(piece: Tv2Piece): void {
    if (this.pieceStack.pieces.indexOf(piece) > -1) {
      return
    }
    this.pieceStack.start = piece.start < this.pieceStack.start ? piece.start : this.pieceStack.start

    if (piece.duration) {
      this.pieceStack.duration = piece.duration > this.pieceStack.duration ? piece.duration : 0
    }

    // const pieceToUpdate: Tv2Piece | undefined = this.pieceStack.pieces.find(p => p.id === piece.id)
    // if (pieceToUpdate) {
    //   this.pieceStack.pieces[this.pieceStack.pieces.indexOf(pieceToUpdate)] = piece
    // } else {
    //   this.pieceStack.pieces.push(piece)
    // }

    this.pieceStack.pieces.push(piece)
  }

  public getPieceStack(): Tv2PieceStack {
    this.pieceStack.stacks = this.pieceStack.pieces.reduce(
      (stacks, piece) => {
        if (!(piece.start in stacks)) {
          stacks[piece.start] = []
        }
        if (stacks[piece.start].indexOf(piece) < 0) {
          stacks[piece.start].push(piece)
        }
        return stacks
      },
      {} as Record<number, Tv2Piece[]>
    )

    this.pieceStack.stackKeys = Object.keys(this.pieceStack.stacks).map(key => parseInt(key, 10))
    this.pieceStack.piecesNames = this.pieceStack.pieces.map(piece => piece.name)

    return this.pieceStack
  }
}
