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
  public playedDuration: number

  constructor(part: PartInterface) {
    this.id = part.id
    this.segmentId = part.segmentId
    this.isOnAir = part.isOnAir
    this.isNext = part.isNext
    this.pieces = part.pieces
    this.adLibPieces = []
    this.executedAt = 0 //part.executedAt
    this.expectedDuration = part.expectedDuration
    this.playedDuration = 0 // TODO: Get this from backend.
  }

  public putOnAir(): void {
    this.isOnAir = true
    this.executedAt = Date.now() // TODO: This should come from the backend.
  }

  public takeOffAir(): void {
    this.isOnAir = false
    if (this.executedAt > 0 && this.playedDuration === 0) {
      this.playedDuration = Date.now() - this.executedAt
    }
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

  public getDuration(): number {
    const expectedDuration = this.expectedDuration ?? 4000
    if (this.isOnAir && this.executedAt > 0) {
      return Math.max(expectedDuration, Date.now() - this.executedAt)
    } else if (this.playedDuration > 0) {
      return this.playedDuration
    }
    return expectedDuration
  }
}
