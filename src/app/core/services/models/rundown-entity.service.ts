import { Rundown } from '../../models/rundown'
import { SegmentEntityService } from './segment-entity.service'
import { Segment } from '../../models/segment'
import { RundownCursor } from '../../models/rundown-cursor'
import { Injectable } from '@angular/core'
import { Piece } from '../../models/piece'
import { Part } from '../../models/part'
import { BasicRundown } from '../../models/basic-rundown'
import { RundownMode } from '../../enums/rundown-mode'

@Injectable()
export class RundownEntityService {
  constructor(private readonly segmentEntityService: SegmentEntityService) {}

  public activate(rundown: Rundown): Rundown {
    const rundownState: Rundown = rundown.mode === RundownMode.REHEARSAL ? rundown : this.reset(rundown)
    return {
      ...rundownState,
      mode: RundownMode.ACTIVE,
    }
  }

  public rehearse(rundown: Rundown): Rundown {
    const resetRundown: Rundown = this.reset(rundown)
    return {
      ...resetRundown,
      mode: RundownMode.REHEARSAL,
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
      mode: RundownMode.INACTIVE,
      segments: this.unmarkSegmentsSetAsNext(this.takeAllSegmentsOffAir(rundown, deactivatedAt)),
      infinitePieces: [],
    }
  }

  private takeAllSegmentsOffAir(rundown: Rundown, takenOffAirAt: number): Segment[] {
    return rundown.segments.map(segment => this.segmentEntityService.takeOffAir(segment, takenOffAirAt))
  }

  public takeNext(rundown: Rundown, rundownCursor: RundownCursor, putOnAirAt: number): Rundown {
    const segmentsPossiblyWithoutSegmentOnAir: Segment[] = this.takeOnAirSegmentsOffAirIfNotNext(rundown.segments, putOnAirAt, rundownCursor)
    return {
      ...rundown,
      segments: this.putSegmentOnAir(segmentsPossiblyWithoutSegmentOnAir, rundownCursor, putOnAirAt),
    }
  }

  private takeOnAirSegmentsOffAirIfNotNext(segments: Readonly<Segment[]>, takenOffAirAt: number, nextCursor: RundownCursor): Segment[] {
    return segments.map(segment => (segment.isOnAir && segment.id !== nextCursor.segmentId ? this.segmentEntityService.takeOffAir(segment, takenOffAirAt) : segment))
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
    const segmentsWithoutUnplannedUnplayedParts: Segment[] = segmentsWithNextSegmentPossiblyReset.map(segment =>
      segment.isNext ? this.segmentEntityService.removeUnplannedUnplayedPartsAndPieces(segment) : segment
    )
    return {
      ...rundown,
      segments: this.setSegmentAsNext(this.unmarkSegmentsSetAsNext(segmentsWithoutUnplannedUnplayedParts), rundownCursor),
    }
  }

  private resetSegmentIfOffAir(segments: Readonly<Segment[]>, segmentId: string): Segment[] {
    return segments.map(segment => (segment.id === segmentId && !segment.isOnAir ? this.segmentEntityService.reset(segment) : segment))
  }

  private unmarkSegmentsSetAsNext(segments: Segment[]): Segment[] {
    return segments.map(segment => (segment.isNext ? this.segmentEntityService.unmarkSegmentAsNext(segment) : segment))
  }

  private setSegmentAsNext(segments: Segment[], rundownCursor: RundownCursor): Segment[] {
    return segments.map(segment => (segment.id === rundownCursor.segmentId ? this.segmentEntityService.setAsNextSegment(segment, rundownCursor.partId) : segment))
  }

  public updateInfinitePieces(rundown: Rundown, infinitePieces: Piece[]): Rundown {
    return {
      ...rundown,
      infinitePieces: [...infinitePieces],
    }
  }

  public insertPartAsOnAir(rundown: Rundown, part: Part, insertedAt: number): Rundown {
    return {
      ...rundown,
      segments: rundown.segments.map(segment => (segment.id === part.segmentId ? this.segmentEntityService.insertPartAsOnAir(segment, part, insertedAt) : segment)),
    }
  }

  public insertPartAsNext(rundown: Rundown, part: Part): Rundown {
    return {
      ...rundown,
      segments: rundown.segments
        .map(segment => (segment.isNext ? this.segmentEntityService.unmarkSegmentAsNext(segment) : segment))
        .map(segment => (segment.id === part.segmentId ? this.segmentEntityService.insertPartAsNext(segment, part) : segment)),
    }
  }

  public insertPiece(rundown: Rundown, rundownCursor: RundownCursor, piece: Piece): Rundown {
    return {
      ...rundown,
      segments: rundown.segments.map(segment => (segment.id === rundownCursor.segmentId ? this.segmentEntityService.insertPiece(segment, rundownCursor.partId, piece) : segment)),
    }
  }

  public updateRundownFromBasicRundown(rundown: Rundown, basicRundown: BasicRundown): Rundown {
    return {
      ...rundown,
      ...basicRundown,
    }
  }

  public insertSegmentInRundown(rundown: Rundown, segment: Segment): Rundown {
    return {
      ...rundown,
      segments: [...rundown.segments, segment].sort((a, b) => a.rank - b.rank)
    }
  }

  public updateSegmentInRundown(rundown: Rundown, updatedSegment: Segment): Rundown {
    return {
      ...rundown,
      segments: rundown.segments
        .map(segment => segment.id !== updatedSegment.id ? segment : updatedSegment)
        .sort((a, b) => a.rank - b.rank)
    }
  }

  public removeSegmentFromRundown(rundown: Rundown, segmentId: string): Rundown {
    return {
      ...rundown,
      segments: rundown.segments.filter(segment => segment.id !== segmentId)
    }
  }

  public unsyncSegmentInRundown(rundown: Rundown, unsyncedSegment: Segment, originalSegmentId: string): Rundown {
    return this.insertSegmentInRundown(this.removeSegmentFromRundown(rundown, originalSegmentId), unsyncedSegment)
  }

  public insertPartInSegment(rundown: Rundown, part: Part): Rundown {
    return {
      ...rundown,
      segments: rundown.segments.map(segment => segment.id !== part.segmentId ? segment : ({
        ...segment,
        parts: [...segment.parts, part].sort((a,b) => a.rank - b.rank)
      }))
    }
  }

  public updatePartInSegment(rundown: Rundown, partToUpdate: Part): Rundown {
    return {
      ...rundown,
      segments: rundown.segments.map(segment => segment.id !== partToUpdate.segmentId ? segment : ({
        ...segment,
        parts: segment.parts
          .map(part => part.id !== partToUpdate.id ? part : partToUpdate)
          .sort((a,b) => a.rank - b.rank)
      }))
    }
  }

  public removePartFromSegment(rundown: Rundown, segmentId: string, partId: string): Rundown {
    return {
      ...rundown,
      segments: rundown.segments.map(segment => segment.id !== segmentId ? segment : ({
        ...segment,
        parts: segment.parts.filter(part => part.id !== partId),
      }))
    }
  }

  public unSyncPartInSegment(rundown: Rundown, partToUnSynchronize: Part): Rundown {
    return this.updatePartInSegment(rundown, partToUnSynchronize)
  }
}
