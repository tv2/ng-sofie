import { Piece } from './piece'
import { AdLibPiece } from './ad-lib-piece'

export interface PartInterface {
  id: string
  segmentId: string
  isOnAir: boolean
  isNext: boolean
  pieces: Piece[]
}

export class Part {
  id: string
  segmentId: string
  isOnAir: boolean
  isNext: boolean
  pieces: Piece[]
  adLibPieces: AdLibPiece[]

  constructor(part: PartInterface) {
    this.id = part.id
    this.segmentId = part.segmentId
    this.isOnAir = part.isOnAir
    this.isNext = part.isNext
    this.pieces = part.pieces
    this.adLibPieces = []
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

  public insetAdLibPiece(adLibPiece: AdLibPiece): void {
    this.adLibPieces.push(adLibPiece)
  }
}
