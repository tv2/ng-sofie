export interface Piece {
  readonly id: string
  readonly partId: string
  readonly name: string
  readonly layer: string
  readonly start: number
  readonly duration?: number
  readonly isPlanned: boolean
  readonly metadata?: unknown
}
