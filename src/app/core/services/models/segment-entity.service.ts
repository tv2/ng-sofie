import { Segment } from '../../models/segment'
import { Part } from '../../models/part'
import { Injectable } from '@angular/core'
import { PartEntityService } from './part-entity.service'

@Injectable()
export class SegmentEntityService {
  constructor(private readonly partEntityService: PartEntityService) {}

  public putOnAir(segment: Segment, partId: string, timestamp: number): Segment {
    return {
      ...segment,
      isOnAir: true,
      parts: this.putPartOnAir(segment, partId, timestamp),
    }
  }

  private putPartOnAir(segment: Segment, partId: string, timestamp: number): Part[] {
    return segment.parts.map(part => (part.id === partId ? this.partEntityService.putOnAir(part, timestamp) : part))
  }

  public takeOffAir(segment: Segment, timestamp: number): Segment {
    return {
      ...segment,
      isOnAir: false,
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
    return segment.parts.map(part => (part.id === partId ? this.partEntityService.setAsNextPart(part) : part))
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
    const segmentWithOnlyPlannedOrPlayedParts: Segment = this.removeUnplannedUnplayedParts(segment)
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

  public removeUnplannedUnplayedParts(segment: Segment): Segment {
    return {
      ...segment,
      parts: segment.parts.filter(part => part.isOnAir || part.isPlanned || part.playedDuration > 0),
    }
  }
}
