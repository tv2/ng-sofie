import { ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core'
import { PartEntityService } from '../../../core/services/models/part-entity.service'
import { Part } from '../../../core/models/part'
import { Tv2PieceGroupService } from '../../services/tv2-piece-group.service'
import { Piece } from '../../../core/models/piece'
import { Tv2OutputLayer } from '../../../core/models/tv2-output-layer'
import { Tv2Piece } from '../../../core/models/tv2-piece'

const KEEP_VISIBLE_DURATION_IN_MS: number = 20_000

@Component({
  selector: 'sofie-offsetable-part',
  templateUrl: './offsetable-part.component.html',
  styleUrls: ['./offsetable-part.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffsetablePartComponent implements OnChanges {
  @Input()
  public part: Part

  @Input()
  public outputLayers: Tv2OutputLayer[]

  @Input()
  public pixelsPerSecond: number

  @Input()
  public isAutoNextStarted: boolean

  @Input()
  public offsetDurationInMs: number

  @Input()
  public prePlayheadDurationInMs: number = 0

  @Input()
  public postPlayheadDurationInMs: number = 0

  @Input()
  public rundownId: string

  @Input()
  public isRundownActive: boolean

  public piecesGroupedByOutputLayer: Record<Tv2OutputLayer, Piece[]> = {} as Record<Tv2OutputLayer, Piece[]>
  public readonly autoLabel: string = $localize`global.auto.label`
  public readonly nextLabel: string = $localize`global.next.label`

  constructor(
    private readonly partEntityService: PartEntityService,
    private readonly pieceGroupService: Tv2PieceGroupService
  ) {}

  @HostBinding('style.width.px')
  public get displayDurationInPixels(): number {
    return (this.pixelsPerSecond * this.getDisplayDurationInMs()) / 1000
  }

  public getDisplayDurationInMs(): number {
    const visibleDurationInMs: number = Math.max(0, this.partDurationInMs() - Math.max(0, this.offsetDurationInMs))
    if (this.part.autoNext) {
      return visibleDurationInMs
    }
    return Math.max(visibleDurationInMs, this.prePlayheadDurationInMs + this.postPlayheadDurationInMs)
  }

  public get playedDurationInMs(): number {
    if (!this.part.isOnAir) {
      return 0
    }
    return Date.now() - this.part.executedAt
  }

  public partDurationInMs(): number {
    return this.partEntityService.getDuration(this.part, Date.now())
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const partChange: SimpleChange | undefined = changes['part']
    if (partChange) {
      if (partChange.previousValue?.pieces === partChange.currentValue?.pieces) {
        return
      }
      const visiblePieces: Piece[] = this.getVisiblePieces()
      // TODO: How do we convert this correctly from Piece to Tv2Piece?
      const piecesGroupedByOutputLayer: Record<Tv2OutputLayer, Tv2Piece[]> = this.pieceGroupService.groupByOutputLayer(visiblePieces as Tv2Piece[])

      const outputLayerPieceEntries: [string, Tv2Piece[]][] = Object.entries(piecesGroupedByOutputLayer).reduce(
        (reducedPieces, [outputLayer, pieces]) => {
          return [...reducedPieces, [outputLayer, this.pieceGroupService.mergePiecesByStartOffset(pieces)]]
        },
        [] as [string, Tv2Piece[]][]
      )

      this.piecesGroupedByOutputLayer = Object.fromEntries(outputLayerPieceEntries) as Record<Tv2OutputLayer, Tv2Piece[]>
    }
  }

  private getVisiblePieces(): Piece[] {
    const displayDurationInMs = this.getDisplayDurationInMs()
    return this.part.pieces.filter(piece => this.isPieceVisible(piece, displayDurationInMs))
  }

  private isPieceVisible(piece: Piece, displayDurationInMs: number): boolean {
    const partDurationInMsAtEndOfPartViewport: number = this.offsetDurationInMs + displayDurationInMs
    if (!piece.duration) {
      return piece.start <= partDurationInMsAtEndOfPartViewport
    }
    const pieceEndTimeInMs: number = piece.start + piece.duration
    return piece.start - KEEP_VISIBLE_DURATION_IN_MS <= partDurationInMsAtEndOfPartViewport && pieceEndTimeInMs + KEEP_VISIBLE_DURATION_IN_MS >= this.offsetDurationInMs
  }

  public trackPiece(_: number, piece: Piece): string {
    return piece.id
  }
}
