import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, SimpleChange, SimpleChanges } from '@angular/core'
import { Piece } from '../../../core/models/piece'
import { Tv2Piece } from '../../../core/models/tv2-piece'
import { Part } from '../../../core/models/part'

@Component({
  selector: 'sofie-offsetable-stack',
  templateUrl: './offsetable-stack.component.html',
  styleUrls: ['./offsetable-stack.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffsetableStackComponent implements OnChanges, OnDestroy {
  @Input() public part: Part
  @Input() public piecesForStack: Tv2Piece[]
  @Input() protected pixelsPerSecond: number = 0
  @Input() protected prePlayheadDurationInMs: number = 0
  @Input() protected postPlayheadDurationInMs: number = 0
  @Input() public offsetDurationInMs: number = 0
  @Input() public dataInTranzit: Tv2PieceDataInTranzit = {} as Tv2PieceDataInTranzit

  protected pieceStack: Tv2PieceStack = {
    start: 0,
    duration: 0,
    pieces: [],
    stacks: {},
    stackKeys: [],
  }

  constructor() {}

  public ngOnChanges(changes: SimpleChanges): void {
    let shown: boolean = false

    const piecesForStackChange: SimpleChange | undefined = changes['piecesForStack']
    if (piecesForStackChange && piecesForStackChange.currentValue.length > 0) {
      this.pieceStack = this.createPieceStack(piecesForStackChange.currentValue)
      shown = true
    }

    const dataInTranzitChange: SimpleChange | undefined = changes['dataInTranzit']
    if (dataInTranzitChange) {
      this.dataInTranzit = dataInTranzitChange.currentValue
      shown = true
    }

    if (!shown) {
      // eslint-disable-next-line no-console
      console.log(this.pieceStack)
    }
  }

  public ngOnDestroy(): void {
    throw new Error(`Method not implemented.`)
  }

  public get playedDurationInMs(): number {
    if (!this.part.isOnAir) {
      return 0
    }
    return Date.now() - this.part.executedAt
  }

  private createPieceStack(pieces: Piece[]): Tv2PieceStack {
    const stacker = new Tv2PieceStacker()
    pieces.forEach(piece => stacker.stackPiece(piece as Tv2Piece))
    return stacker.getPieceStack()
  }

  protected getPixelsPerSecond(): number {
    return this.dataInTranzit.pixelsPerSecond
  }

  protected getPrePlayheadDurationInMs(): number {
    return this.dataInTranzit.prePlayheadDurationInMs
  }

  protected getPostPlayheadDurationInMs(): number {
    return this.dataInTranzit.postPlayheadDurationInMs
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
  stacks: Record<number, Tv2Piece[]>
  stackKeys: number[]
}

class Tv2PieceStacker {
  private pieceStack: Tv2PieceStack = {
    start: Number.MAX_SAFE_INTEGER,
    duration: 0,
    pieces: [],
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

    this.pieceStack.pieces.push(piece)
  }

  public getPieceStack(): Tv2PieceStack {
    this.pieceStack.stacks = this.pieceStack.pieces.reduce(
      (stacks, piece) => {
        if (!(piece.start in stacks)) {
          stacks[piece.start] = []
        }
        stacks[piece.start].push(piece)
        return stacks
      },
      {} as Record<number, Tv2Piece[]>
    )
    this.pieceStack.stackKeys = Object.keys(this.pieceStack.stacks).map(key => parseInt(key, 10))
    return this.pieceStack
  }
}
