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

  @ViewChild('pieceStackToggle')
  protected pieceStackToggle: ElementRef<HTMLDivElement>

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
    if (!this.pieceStackToggle) {
      return
    }
    const stackElements: Element | null | undefined = this.pieceStackToggle.nativeElement.parentNode?.querySelector('div.piece-stack')
    if (!stackElements) {
      return
    }
    if (stackElements.classList.contains('hidden-click')) {
      stackElements.classList.replace('hidden-click', 'piece-stack-click')
    } else {
      stackElements.classList.replace('piece-stack-click', 'hidden-click')
    }
    // piece tooltip component to be created
    //
    // const pieceStackTogglesLeft: number = this.pieceStackToggle.nativeElement.getBoundingClientRect().left
    // const pieceStackToggleTop: number = this.pieceStackToggle.nativeElement.getBoundingClientRect().top
    // document.querySelectorAll('div.stack-tooltip').forEach((element: Element) => {
    //   element.remove()
    // })
    // const stackTooltip: HTMLDivElement = document.createElement('div', { is: 'stack-tooltip' })
    // stackTooltip.classList.add('stack-tooltip')
    // stackTooltip.style.position = 'absolute'
    // stackTooltip.style.left = `${pieceStackTogglesLeft}px`
    // stackTooltip.style.top = `${22 + pieceStackToggleTop}px`
    // stackTooltip.innerHTML = stackElements.innerHTML
    // document.body.append(stackTooltip)
    // setTimeout(() => {
    //   document.querySelectorAll('div.stack-tooltip').forEach((element: Element) => {
    //     element.remove()
    //   })
    // }, 5000)
  }

  protected getPieceStackToggleText(outputLayer: Tv2OutputLayer, startKey: string): string {
    return this.piecesGroupedByOutputLayerThenStart[outputLayer][+startKey]
      .map(
        piece =>
          // `${piece.start}:${piece.id}@${piece.name}`
          `[${piece.start / 1000}s,${piece.duration || 0 / 1000 || '-'}s]${piece.name}`
      )
      .join(', ')
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
}
