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

  public activate(rundownCursor: RundownCursor, timestamp: number): void {
    this.reset()
    this.isActive = true
    const segment: Segment | undefined = this.segments.find(segment => segment.id === rundownCursor.segmentId)
    if (!segment) {
      // Handle unable to activate
      return
    }
    segment.putOnAir(rundownCursor.partId, timestamp)
  }

  private reset(): void {
    this.segments.forEach(segment => segment.reset())
  }

  public deactivate(timestamp: number): void {
    this.isActive = false
    this.takeAllSegmentsOffAir(timestamp)
    this.infinitePieces = new Map()
  }

  private takeAllSegmentsOffAir(timestamp: number): void {
    this.segments.forEach(segment => segment.takeOffAir(timestamp))
    this.segments.find(segment => segment.isNext)?.removeAsNextSegment()
  }

  public takeNext(rundownCursor: RundownCursor, timestamp: number): void {
    this.takeOnAirSegmentOffAirIfNotSetAsNext(rundownCursor.segmentId, timestamp)
    const segmentToComeOnAir: Segment | undefined = this.segments.find(segment => segment.id === rundownCursor.segmentId)
    if (!segmentToComeOnAir) {
      // TODO: Handle no segment
      return
    }
    segmentToComeOnAir.putOnAir(rundownCursor.partId, timestamp)
  }

  private takeOnAirSegmentOffAirIfNotSetAsNext(nextSegmentId: string, timestamp: number): void {
    const onAirSegment = this.segments.find(segment => segment.isOnAir)
    if (!onAirSegment || onAirSegment.id === nextSegmentId) {
      return
    }
    onAirSegment.takeOffAir(timestamp)
  }

  public setNext(rundownCursor: RundownCursor): void {
    const oldNextSegment: Segment | undefined = this.segments.find(segment => segment.isNext)
    const newNextSegment: Segment | undefined = this.segments.find(segment => segment.id === rundownCursor.segmentId)

    if (this.isOffAirSegmentSetAsNext(newNextSegment)) {
      newNextSegment!.reset()
    }
    oldNextSegment?.removeAsNextSegment()
    newNextSegment?.setAsNextSegment(rundownCursor.partId)
  }

  private isOffAirSegmentSetAsNext(segment: Segment | undefined): boolean {
    return segment === undefined || !segment.isOnAir
  }

  public addInfinitePiece(infinitePiece: Piece): void {
    this.infinitePieces.set(infinitePiece.layer, infinitePiece)
  }

  public getInfinitePieces(): Piece[] {
    return Array.from(this.infinitePieces.values())
  }
}
