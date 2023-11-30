import { Rundown } from '../../models/rundown'
import { SegmentEntityService } from './segment-entity.service'
import { Segment } from '../../models/segment'
import { RundownCursor } from '../../models/rundown-cursor'
import { Injectable } from '@angular/core'
import { Piece } from '../../models/piece'
import { Part } from '../../models/part'
import { BasicRundown } from '../../models/basic-rundown'

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
    const segmentsPossiblyWithoutSegmentOnAir: Segment[] = this.takeOnAirSegmentsOffAirIfNotNext(rundown.segments, putOnAirAt, rundownCursor)
    return {
      ...rundown,
      segments: this.putSegmentOnAir(segmentsPossiblyWithoutSegmentOnAir, rundownCursor, putOnAirAt),
    }
  }

  private takeOnAirSegmentsOffAirIfNotNext(segments: Segment[], takenOffAirAt: number, nextCursor: RundownCursor): Segment[] {
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
      infinitePieces: [...rundown.infinitePieces.filter(infinitePiece => infinitePiece.id !== infinitePieceToAdd.id), infinitePieceToAdd],
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

  public updateRundownSegment(rundown: Rundown, segment: Segment): Rundown {
    const segmentToUpdateIndex: number | undefined = rundown.segments.findIndex(existingSegment => existingSegment.id === segment.id)
    if (segmentToUpdateIndex) {
      rundown.segments[segmentToUpdateIndex] = segment
    }
    return rundown
  }

  public removeRundownSegment(rundown: Rundown, segmentId: string): Rundown {
    const segmentToRemoveIndex: number | undefined = rundown.segments.findIndex(existingSegment => existingSegment.id === segmentId)
    rundown.segments.splice(segmentToRemoveIndex, 1)
    return rundown
  }

  public createRundownSegment(rundown: Rundown, segment: Segment): Rundown {
    const insertAtIndex: number = rundown.segments.findIndex(existingSegment => existingSegment.rank > segment.rank)
    rundown.segments.splice(insertAtIndex, 0, segment)
    return rundown
  }

  public createRundownPart(rundown: Rundown, part: Part): Rundown {
    const segmentForPartIndex: number | undefined = rundown.segments.findIndex(segment => segment.id === part.segmentId)
    if (!segmentForPartIndex) {
      return rundown
    }
    rundown.segments[segmentForPartIndex].parts.push(part)
    return rundown
  }

  public updateRundownPart(rundown: Rundown, part: Part): Rundown {
    const segmentForPartIndex: number | undefined = rundown.segments.findIndex(segment => segment.id === part.segmentId)
    if (!segmentForPartIndex) {
      return rundown
    }
    const partToUpdateIndex: number | undefined = rundown.segments[segmentForPartIndex].parts.findIndex(existingPart => existingPart.id === part.id)
    if (partToUpdateIndex) {
      rundown.segments[segmentForPartIndex].parts[partToUpdateIndex] = part
    }
    return rundown
  }

  public removeRundownPart(rundown: Rundown, segmentId: string, partId: string): Rundown {
    const segmentForPartIndex: number | undefined = rundown.segments.findIndex(existingSegment => existingSegment.id === segmentId)
    if (!rundown.segments[segmentForPartIndex].parts) {
      return rundown
    }
    const partToRemoveIndex: number | undefined = rundown.segments[segmentForPartIndex].parts.findIndex(existingPart => existingPart.id === partId)
    rundown.segments[segmentForPartIndex].parts.splice(partToRemoveIndex, 1)
    return rundown
  }
}
