import { Segment, SegmentInterface } from './segment'
import { PartEvent } from './rundown-event'
import { Piece } from './piece'

export interface RundownInterface {
  id: string
  name: string
  isActive: boolean
  segments: SegmentInterface[]
  infinitePieces: Piece[]
}

export class Rundown {
  id: string
  name: string
  isActive: boolean
  segments: Segment[]

  private infinitePieces: Map<string, Piece> = new Map()

  constructor(rundown: RundownInterface) {
    this.id = rundown.id
    this.name = rundown.name
    this.isActive = rundown.isActive
    this.segments = rundown.segments.map(segment => new Segment(segment))
    rundown.infinitePieces.forEach(piece => this.infinitePieces.set(piece.layer, piece))
  }


  public activate(activateEvent: { segmentId: string, partId: string }): void {
    this.isActive = true
    const segment: Segment | undefined = this.segments.find(segment => segment.id === activateEvent.segmentId)
    if (!segment) {
      // Handle unable to activate
      return
    }
    segment.putOnAir(activateEvent)
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

  public takeNext(takeEvent: { segmentId: string, partId: string }): void {
    this.takeAllSegmentsOffAir()
    const segmentToComeOnAir: Segment | undefined = this.segments.find(segment => segment.id === takeEvent.segmentId)
    if (!segmentToComeOnAir) {
      // TODO: Handle no segment
      return
    }
    segmentToComeOnAir.putOnAir(takeEvent)
  }

  public setNext(setNextEvent: PartEvent): void {
    this.segments.find(segment => segment.isNext)?.removeAsNextSegment()
    this.segments.find(segment => segment.id === setNextEvent.segmentId)?.setAsNextSegment(setNextEvent)
  }

  public addInfinitePiece(infinitePiece: Piece): void {
    this.infinitePieces.set(infinitePiece.layer, infinitePiece)
  }

  public getInfinitePieces(): Piece[] {
    return Array.from(this.infinitePieces.values())
  }
}
