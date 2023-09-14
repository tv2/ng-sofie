import { Segment, SegmentInterface } from './segment'
import { Piece } from './piece'
import { BasicRundown } from './basic-rundown'
import { RundownCursor } from './rundown-cursor'

export interface RundownInterface extends BasicRundown {
  segments: SegmentInterface[]
  infinitePieces: Piece[]
}

export class Rundown {
  id: string
  name: string
  isActive: boolean
  modifiedAt: number
  segments: Segment[]

  private infinitePieces: Map<string, Piece> = new Map()

  constructor(rundown: RundownInterface) {
    this.id = rundown.id
    this.name = rundown.name
    this.isActive = rundown.isActive
    this.modifiedAt = rundown.modifiedAt
    this.segments = rundown.segments.map(segment => new Segment(segment))
    rundown.infinitePieces.forEach(piece => this.infinitePieces.set(piece.layer, piece))
  }

  public activate(rundownCursor: RundownCursor): void {
    this.isActive = true
    const segment: Segment | undefined = this.segments.find(segment => segment.id === rundownCursor.segmentId)
    if (!segment) {
      // Handle unable to activate
      return
    }
    segment.putOnAir(rundownCursor.partId)
  }

  public deactivate(): void {
    this.isActive = false
    this.takeAllSegmentsOffAir()
    this.infinitePieces = new Map()
  }

  private takeAllSegmentsOffAir(): void {
    this.segments.forEach(segment => segment.takeOffAir())
    this.segments.find(segment => segment.isNext)?.removeAsNextSegment()
  }

  public takeNext(rundownCursor: RundownCursor): void {
    this.takeCurrentSegmentOffAir()
    const segmentToComeOnAir: Segment | undefined = this.segments.find(segment => segment.id === rundownCursor.segmentId)
    if (!segmentToComeOnAir) {
      // TODO: Handle no segment
      return
    }
    segmentToComeOnAir.putOnAir(rundownCursor.partId)
  }

  private takeCurrentSegmentOffAir(): void {
    this.segments.find(segment => segment.isOnAir)?.takeOffAir()
  }

  public setNext(rundownCursor: RundownCursor): void {
    this.segments.find(segment => segment.isNext)?.removeAsNextSegment()
    this.segments.find(segment => segment.id === rundownCursor.segmentId)?.setAsNextSegment(rundownCursor.partId)
  }

  public addInfinitePiece(infinitePiece: Piece): void {
    this.infinitePieces.set(infinitePiece.layer, infinitePiece)
  }

  public getInfinitePieces(): Piece[] {
    return Array.from(this.infinitePieces.values())
  }
}
