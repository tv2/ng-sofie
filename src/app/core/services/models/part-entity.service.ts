import { Part } from '../../models/part'
import { Piece } from '../../models/piece'

export class PartEntityService {
  public readonly defaultPartDurationInMs: number = 4000

  public putOnAir(part: Part, executedAt: number): Part {
    return {
      ...part,
      isOnAir: true,
      isNext: false,
      executedAt,
      playedDuration: 0,
    }
  }

  public takeOffAir(part: Part, takenOffAirAt: number): Part {
    return {
      ...part,
      isOnAir: false,
      playedDuration: this.computePlayedDuration(part, takenOffAirAt),
    }
  }

  private computePlayedDuration(part: Part, takenOffAirAt: number): number {
    return takenOffAirAt - part.executedAt
  }

  public setAsNextPart(part: Part): Part {
    return {
      ...part,
      isNext: true,
    }
  }

  public unmarkPartAsNext(part: Part): Part {
    return {
      ...part,
      isNext: false,
    }
  }

  public reset(part: Part): Part {
    return {
      ...part,
      playedDuration: 0,
      executedAt: 0,
      pieces: part.pieces.filter(piece => piece.isPlanned),
    }
  }

  public getDuration(part: Part): number {
    if (part.isOnAir) {
      const minimumDuration: number = this.getMinimumDuration(part)
      const playedDuration: number = this.getPlayedDuration(part)
      return Math.max(minimumDuration, playedDuration)
    }

    if (part.playedDuration) {
      return part.playedDuration
    }

    return this.getMinimumDuration(part)
  }

  private getMinimumDuration(part: Part): number {
    if (!part.expectedDuration) {
      return this.defaultPartDurationInMs
    }
    if (part.autoNext) {
      return part.expectedDuration - part.autoNext.overlap
    }
    return part.expectedDuration
  }

  public getPlayedDuration(part: Part): number {
    if (part.playedDuration) {
      return part.playedDuration
    }
    if (part.executedAt > 0) {
      return Date.now() - part.executedAt
    }
    return 0
  }

  public getExpectedDuration(part: Part): number {
    if (part.isUntimed) {
      return 0
    }
    if (!part.expectedDuration) {
      return 0
    }
    if (part.autoNext) {
      return part.expectedDuration - part.autoNext.overlap
    }
    return part.expectedDuration
  }

  public insertPiece(part: Part, piece: Piece): Part {
    return {
      ...part,
      pieces: [...part.pieces, piece],
    }
  }
}
