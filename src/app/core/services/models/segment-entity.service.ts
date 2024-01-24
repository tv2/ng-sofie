import { Segment } from '../../models/segment'
import { Part } from '../../models/part'
import { Injectable } from '@angular/core'
import { PartEntityService } from './part-entity.service'
import { Piece } from '../../models/piece'

@Injectable()
export class SegmentEntityService {
  constructor(private readonly partEntityService: PartEntityService) {}

  public putOnAir(segment: Segment, partId: string, timestamp: number): Segment {
    const segmentWithoutOnAirParts: Segment = {
      ...segment,
      parts: this.takeOnAirPartsOffAir(segment, timestamp),
    }
    return {
      ...segmentWithoutOnAirParts,
      isOnAir: true,
      executedAtEpochTime: segment.executedAtEpochTime ?? timestamp,
      parts: this.putPartOnAir(segmentWithoutOnAirParts, partId, timestamp),
    }
  }

  private putPartOnAir(segment: Segment, partId: string, timestamp: number): Part[] {
    return segment.parts.map(part => (part.id === partId ? this.partEntityService.putOnAir(part, timestamp) : part))
  }

  public takeOffAir(segment: Segment, timestamp: number): Segment {
    return {
      ...segment,
      isOnAir: false,
      executedAtEpochTime: undefined,
      parts: this.takeOnAirPartsOffAir(segment, timestamp),
    }
  }

  private takeOnAirPartsOffAir(segment: Segment, timestamp: number): Part[] {
    return segment.parts.map(part => (part.isOnAir ? this.partEntityService.takeOffAir(part, timestamp) : part))
  }

  public setAsNextSegment(segment: Segment, partId: string): Segment {
    return {
      ...segment,
      isNext: true,
      parts: this.setPartAsNext(segment, partId),
    }
  }

  private setPartAsNext(segment: Segment, partId: string): Part[] {
    const partsWithoutUnplannedPiecesOnNextPart: Part[] = segment.parts.map(part => (part.isNext ? this.partEntityService.reset(part) : part))
    return partsWithoutUnplannedPiecesOnNextPart.map(part => (part.id === partId ? this.partEntityService.setAsNextPart(part) : part))
  }

  public unmarkSegmentAsNext(segment: Segment): Segment {
    return {
      ...segment,
      isNext: false,
      parts: this.unmarkPartsSetAsNext(segment),
    }
  }

  private unmarkPartsSetAsNext(segment: Segment): Part[] {
    return segment.parts.map(part => (part.isNext ? this.partEntityService.unmarkPartAsNext(part) : part))
  }

  public reset(segment: Segment): Segment {
    return {
      ...segment,
      parts: this.resetParts(segment),
    }
  }

  private resetParts(segment: Segment): Part[] {
    return segment.parts.filter(part => part.isPlanned).map(part => this.partEntityService.reset(part))
  }

  public insertPartAsOnAir(segment: Segment, part: Part, insertedAt: number): Segment {
    const onAirPartIndex: number = segment.parts.findIndex(part => part.isOnAir)
    const onlyOffAirParts: Part[] = this.takeOnAirPartsOffAir(segment, insertedAt)
    return {
      ...segment,
      isOnAir: true,
      parts: this.insertElementAtIndex(onlyOffAirParts, part, onAirPartIndex + 1),
    }
  }

  public insertPartAsNext(segment: Segment, part: Part): Segment {
    const segmentWithOnlyPlannedOrPlayedParts: Segment = this.removeUnplannedUnplayedPartsAndPieces(segment)
    const noNextParts: Part[] = this.unmarkPartsSetAsNext(segmentWithOnlyPlannedOrPlayedParts)
    const onAirPartIndex: number = segment.parts.findIndex(part => part.isOnAir)
    return {
      ...segment,
      isNext: true,
      parts: this.insertElementAtIndex(noNextParts, part, onAirPartIndex + 1),
    }
  }

  private insertElementAtIndex<T>(elements: T[], element: T, index: number): T[] {
    return [...elements.slice(0, index), element, ...elements.slice(index)]
  }

  public removeUnplannedUnplayedPartsAndPieces(segment: Segment): Segment {
    return {
      ...segment,
      parts: segment.parts.filter(part => part.isOnAir || part.isPlanned || part.playedDuration > 0).map(part => (part.isNext ? this.partEntityService.reset(part) : part)),
    }
  }

  public insertPiece(segment: Segment, partId: string, piece: Piece): Segment {
    return {
      ...segment,
      parts: segment.parts.map(part => (part.id === partId ? this.partEntityService.insertPiece(part, piece) : part)),
    }
  }
}
