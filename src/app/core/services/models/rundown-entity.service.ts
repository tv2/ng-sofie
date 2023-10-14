import { Rundown } from '../../models/rundown'
import { SegmentEntityService } from './segment-entity.service'
import { Segment } from '../../models/segment'
import { RundownCursor } from '../../models/rundown-cursor'
import { Injectable } from '@angular/core'
import { Piece } from '../../models/piece'

@Injectable()
export class RundownEntityService {
  constructor(private readonly segmentService: SegmentEntityService) {}

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
      segments: rundown.segments.map(segment => this.segmentService.reset(segment)),
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
    return rundown.segments.map(segment => this.segmentService.takeOffAir(segment, takenOffAirAt))
  }

  public takeNext(rundown: Rundown, rundownCursor: RundownCursor, putOnAirAt: number): Rundown {
    const segmentsPossiblyWithoutSegmentOnAir: Segment[] = this.takeOnAirSegmentsOffAir(rundown.segments, putOnAirAt)
    return {
      ...rundown,
      segments: this.putSegmentOnAir(segmentsPossiblyWithoutSegmentOnAir, rundownCursor, putOnAirAt),
    }
  }

  private takeOnAirSegmentsOffAir(segments: Segment[], takenOffAirAt: number): Segment[] {
    return segments.map(segment => (segment.isOnAir ? this.segmentService.takeOffAir(segment, takenOffAirAt) : segment))
  }

  private putSegmentOnAir(segments: Segment[], rundownCursor: RundownCursor, takenAt: number): Segment[] {
    return segments.map(segment => {
      if (segment.id !== rundownCursor.segmentId) {
        return segment
      }
      return this.segmentService.putOnAir(segment, rundownCursor.partId, takenAt)
    })
  }

  public setNext(rundown: Rundown, rundownCursor: RundownCursor): Rundown {
    const segmentsWithNextSegmentPossiblyReset: Segment[] = this.resetSegmentIfOffAir(rundown.segments, rundownCursor.segmentId)
    return {
      ...rundown,
      segments: this.setSegmentAsNext(this.unmarkSegmentsSetAsNext(segmentsWithNextSegmentPossiblyReset), rundownCursor),
    }
  }

  private resetSegmentIfOffAir(segments: Segment[], segmentId: string): Segment[] {
    return segments.map(segment => (segment.id === segmentId && !segment.isOnAir ? this.segmentService.reset(segment) : segment))
  }

  private unmarkSegmentsSetAsNext(segments: Segment[]): Segment[] {
    return segments.map(segment => (segment.isNext ? this.segmentService.removeAsNextSegment(segment) : segment))
  }

  private setSegmentAsNext(segments: Segment[], rundownCursor: RundownCursor): Segment[] {
    return segments.map(segment => (segment.id === rundownCursor.segmentId ? this.segmentService.setAsNextSegment(segment, rundownCursor.partId) : segment))
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
}
