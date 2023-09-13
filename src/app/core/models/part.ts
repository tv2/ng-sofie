import { Piece } from './piece'
import { AdLibPiece } from './ad-lib-piece'

export interface PartInterface {
  id: string
  segmentId: string
  isOnAir: boolean
  isNext: boolean
  pieces: Piece[]
  expectedDuration?: number
  executedAt: number
}

export class Part {
  public id: string
  public segmentId: string
  public isOnAir: boolean
  public isNext: boolean
  public pieces: Piece[]
  public adLibPieces: AdLibPiece[]
  public expectedDuration?: number
  public executedAt: number

  constructor(part: PartInterface) {
    this.id = part.id
    this.segmentId = part.segmentId
    this.isOnAir = part.isOnAir
    this.isNext = part.isNext
    this.pieces = part.pieces
    this.adLibPieces = []
    this.executedAt = part.executedAt
    this.expectedDuration = part.expectedDuration
  }

  public putOnAir(): void {
    this.isOnAir = true
  }

  public takeOffAir(): void {
    this.isOnAir = false
  }

  public removeAsNextPart(): void {
    this.isNext = false
  }

  public setAsNextPart(): void {
    this.isNext = true
  }

  public insertAdLibPiece(adLibPiece: AdLibPiece): void {
    this.adLibPieces.push(adLibPiece)
  }
}
