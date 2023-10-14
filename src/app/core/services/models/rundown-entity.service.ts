import { Rundown } from '../../models/rundown'
import { SegmentEntityService } from './segment-entity.service'
import { Segment } from '../../models/segment'
import { RundownCursor } from '../../models/rundown-cursor'
import { Injectable } from '@angular/core'
import { Piece } from '../../models/piece'
import { Part } from '../../models/part'
import { timestamp } from 'rxjs'

@Injectable()
export class RundownEntityService {
  constructor(private readonly segmentEntityService: SegmentEntityService) {}

  public activate(rundown: Rundown): Rundown {
    const resetRundown: Rundown = this.reset(rundown)
    return {
      ...resetRundown,
      isActive: true,
    }
  }

  private reset(rundown: Rundown): Rundown {
    return {
      ...rundown,
      segments: rundown.segments.map(segment => this.segmentEntityService.reset(segment)),
    }
  }

  public deactivate(rundown: Rundown, deactivatedAt: number): Rundown {
    return {
      ...rundown,
      isActive: false,
      segments: this.unmarkSegmentsSetAsNext(this.takeAllSegmentsOffAir(rundown, deactivatedAt)),
      infinitePieces: [],
    }
  }

  private takeAllSegmentsOffAir(rundown: Rundown, takenOffAirAt: number): Segment[] {
    return rundown.segments.map(segment => this.segmentEntityService.takeOffAir(segment, takenOffAirAt))
  }

  public takeNext(rundown: Rundown, rundownCursor: RundownCursor, putOnAirAt: number): Rundown {
    const segmentsPossiblyWithoutSegmentOnAir: Segment[] = this.takeOnAirSegmentsOffAir(rundown.segments, putOnAirAt)
    return {
      ...rundown,
      segments: this.putSegmentOnAir(segmentsPossiblyWithoutSegmentOnAir, rundownCursor, putOnAirAt),
    }
  }

  private takeOnAirSegmentsOffAir(segments: Segment[], takenOffAirAt: number): Segment[] {
    return segments.map(segment => (segment.isOnAir ? this.segmentEntityService.takeOffAir(segment, takenOffAirAt) : segment))
  }

  private putSegmentOnAir(segments: Segment[], rundownCursor: RundownCursor, takenAt: number): Segment[] {
    return segments.map(segment => {
      if (segment.id !== rundownCursor.segmentId) {
        return segment
      }
      return this.segmentEntityService.putOnAir(segment, rundownCursor.partId, takenAt)
    })
  }

  public setNext(rundown: Rundown, rundownCursor: RundownCursor): Rundown {
    const segmentsWithNextSegmentPossiblyReset: Segment[] = this.resetSegmentIfOffAir(rundown.segments, rundownCursor.segmentId)
    const segmentsWithoutUnplannedUnplayedParts: Segment[] = segmentsWithNextSegmentPossiblyReset.map(segment => segment.isNext ? this.segmentEntityService.removeUnplannedUnplayedParts(segment) : segment)
    return {
      ...rundown,
      segments: this.setSegmentAsNext(this.unmarkSegmentsSetAsNext(segmentsWithoutUnplannedUnplayedParts), rundownCursor),
    }
  }

  private resetSegmentIfOffAir(segments: Segment[], segmentId: string): Segment[] {
    return segments.map(segment => (segment.id === segmentId && !segment.isOnAir ? this.segmentEntityService.reset(segment) : segment))
  }

  private unmarkSegmentsSetAsNext(segments: Segment[]): Segment[] {
    return segments.map(segment => (segment.isNext ? this.segmentEntityService.unmarkSegmentAsNext(segment) : segment))
  }

  private setSegmentAsNext(segments: Segment[], rundownCursor: RundownCursor): Segment[] {
    return segments.map(segment => (segment.id === rundownCursor.segmentId ? this.segmentEntityService.setAsNextSegment(segment, rundownCursor.partId) : segment))
  }

  public addInfinitePiece(rundown: Rundown, infinitePieceToAdd: Piece): Rundown {
    return {
      ...rundown,
      infinitePieces: [
          ...rundown.infinitePieces.filter(infinitePiece => infinitePiece.id !== infinitePieceToAdd.id),
          infinitePieceToAdd,
      ],
    }
  }

  public insertPartAsOnAir(rundown: Rundown, part: Part, insertedAt: number): Rundown {
    return {
      ...rundown,
      segments: rundown.segments.map(segment => segment.id === part.segmentId ? this.segmentEntityService.insertPartAsOnAir(segment, part, insertedAt) : this.segmentEntityService.takeOffAir(segment, insertedAt))
    }
  }

  public insertPartAsNext(rundown: Rundown, part: Part): Rundown {
    return {
      ...rundown,
      segments: rundown.segments.map(
          segment => segment.id === part.segmentId
          ? this.segmentEntityService.insertPartAsNext(segment, part)
          : this.segmentEntityService.unmarkSegmentAsNext(segment)),
    }
  }
}
