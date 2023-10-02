import { Segment } from '../../models/segment'
import { Part } from '../../models/part'
import { Injectable } from '@angular/core'
import { PartEntityService } from './part-entity.service'

@Injectable()
export class SegmentEntityService {
  constructor(private readonly partService: PartEntityService) {}

  public putOnAir(segment: Segment, partId: string, timestamp: number): Segment {
    return {
      ...segment,
      isOnAir: true,
      parts: this.putPartOnAir(segment, partId, timestamp)
    }
  }

  private putPartOnAir(segment: Segment, partId: string, timestamp: number): Part[] {
    return segment.parts.map(part => part.id === partId ? this.partService.putOnAir(part, timestamp) : part)
  }

  public takeOffAir(segment: Segment, timestamp: number): Segment {
    return {
      ...segment,
      isOnAir: false,
      parts: this.takeOnAirPartsOffAir(segment, timestamp)
    }
  }

  private takeOnAirPartsOffAir(segment: Segment, timestamp: number): Part[] {
    return segment.parts.map(part => part.isOnAir ? this.partService.takeOffAir(part, timestamp) : part)
  }

  public setAsNextSegment(segment: Segment, partId: string): Segment {
    return {
      ...segment,
      isNext: true,
      parts: this.setPartAsNext(segment, partId)
    }
  }

  private setPartAsNext(segment: Segment, partId: string): Part[] {
    return segment.parts.map(part => part.id === partId ? this.partService.setAsNextPart(part) : part)
  }

  public removeAsNextSegment(segment: Segment): Segment {
    return {
      ...segment,
      isNext: false,
      parts: this.removePartsSetAsNext(segment)
    }
  }

  private removePartsSetAsNext(segment: Segment): Part[] {
    return segment.parts.map(part => part.isNext ? this.partService.removeAsNextPart(part) : part)
  }

  public reset(segment: Segment): Segment {
    return {
      ...segment,
      parts: this.resetParts(segment)
    }
  }

  private resetParts(segment: Segment): Part[] {
    return segment.parts.map(part => this.partService.reset(part))
  }
}
