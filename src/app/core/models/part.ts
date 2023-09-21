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
  playedDuration: number
}

const DEFAULT_PART_DURATION_IN_MS: number = 4000

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
    this.executedAt = part.executedAt
    this.expectedDuration = part.expectedDuration
    this.playedDuration = part.playedDuration
  }

  public putOnAir(timestamp: number): void {
    this.isOnAir = true
    this.executedAt = timestamp
    this.playedDuration = 0
  }

  public takeOffAir(timestamp: number): void {
    this.isOnAir = false
    // TODO: Ensure that the data model and flow is sound enough such that this check is not needed.
    if (this.executedAt > 0 && this.playedDuration === 0) {
      this.playedDuration = timestamp - this.executedAt
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
    const expectedDuration = this.expectedDuration ?? DEFAULT_PART_DURATION_IN_MS
    if (this.isOnAir && this.executedAt > 0) {
      return Math.max(expectedDuration, Date.now() - this.executedAt)
    } else if (this.playedDuration > 0) {
      return this.playedDuration
    }
    return expectedDuration
  }

  public reset(): void {
    this.playedDuration = 0
    this.executedAt = 0
  }
}
