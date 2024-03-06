import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, OnChanges, SimpleChange, SimpleChanges, ViewChild } from '@angular/core'
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

  @ViewChild('pieceStackToToggle')
  protected pieceStackToToggle: ElementRef<HTMLDivElement>

  protected piecesGroupedByOutputLayerThenStart: Record<Tv2OutputLayer, Record<number, Tv2Piece[]>> = {} as Record<Tv2OutputLayer, Record<number, Tv2Piece[]>>
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
      const visiblePieces: Piece[] = this.getVisiblePieces()
      // TODO: How do we convert this correctly from Piece to Tv2Piece?
      this.piecesGroupedByOutputLayerThenStart = this.pieceGroupService.groupByOutputLayerThenStart(visiblePieces as Tv2Piece[])
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

  protected getFollowingPieceStart(outputLayer: Tv2OutputLayer, startKey: string, pieceId: string): number | undefined {
    if (!outputLayer || !startKey || !pieceId) {
      return undefined
    }
    const followingPiece: Tv2Piece | undefined = this.piecesGroupedByOutputLayerThenStart[outputLayer][+startKey].find(piece => piece.id === pieceId)
    return followingPiece ? followingPiece.start : undefined
  }

  protected togglePieceStack(): void {
    if (!this.pieceStackToToggle) {
      return
    }
    // todo: replace with piece tooltip component once available
    this.pieceStackToToggle.nativeElement.classList.toggle('hidden-click')
    this.pieceStackToToggle.nativeElement.classList.toggle('piece-stack-click')
  }

  protected getPieceStackToggleText(outputLayer: Tv2OutputLayer, startKey: string): string {
    return this.piecesGroupedByOutputLayerThenStart[outputLayer][+startKey].map(piece => piece.name).join(', ')
  }

  protected numberOfPiecesByOutputLayerAndStartKey(outputLayer: Tv2OutputLayer, startKey: number): number {
    if (!this.piecesGroupedByOutputLayerThenStart[outputLayer] || !this.piecesGroupedByOutputLayerThenStart[outputLayer][startKey]) {
      return 0
    }
    return this.piecesGroupedByOutputLayerThenStart[outputLayer][startKey].length
  }

  protected outputLayerHasItems(outputLayer: Tv2OutputLayer): boolean {
    if (!this.piecesGroupedByOutputLayerThenStart[outputLayer]) {
      return false
    }

    return 0 !== Object.keys(this.piecesGroupedByOutputLayerThenStart[outputLayer]).length
  }

  protected getStartKeysForOutputLayer(outputLayer: Tv2OutputLayer): string[] {
    return Object.keys(this.piecesGroupedByOutputLayerThenStart[outputLayer])
  }

  protected getPieceStackDuration(outputLayer: Tv2OutputLayer, startKey: string): number {
    return ((this.piecesGroupedByOutputLayerThenStart[outputLayer][+startKey].reduce((acc, piece) => acc + (piece.duration || 0), 0) || Number.MAX_SAFE_INTEGER) * this.pixelsPerSecond) / 1000
  }

  protected getPieceStackOffset(outputLayer: Tv2OutputLayer, startKey: string): number {
    return (this.piecesGroupedByOutputLayerThenStart[outputLayer][+startKey][0].start * this.pixelsPerSecond) / 1000
  }
}
