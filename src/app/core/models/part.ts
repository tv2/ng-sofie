import { Piece } from './piece'
import { AdLibPiece } from './ad-lib-piece'
import { AutoNext } from '../models/auto-next'

export interface PartInterface {
  id: string
  segmentId: string
  isOnAir: boolean
  isNext: boolean
  pieces: Piece[]
  expectedDuration?: number
  executedAt: number
  playedDuration: number
  autoNext?: AutoNext
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
  public autoNext: AutoNext | undefined

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
    this.autoNext = part.autoNext
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
    if (this.isOnAir) {
      const minimumDuration: number = this.autoNext?.overlap ?? this.expectedDuration ?? DEFAULT_PART_DURATION_IN_MS
      const playedDuration: number = Date.now() - this.executedAt
      return Math.max(minimumDuration, playedDuration)
    }

    if (this.playedDuration) {
      return this.playedDuration
    }

    return this.autoNext?.overlap ?? this.expectedDuration ?? DEFAULT_PART_DURATION_IN_MS
  }

  public reset(): void {
    this.playedDuration = 0
    this.executedAt = 0
  }
}
