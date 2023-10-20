import { Rundown } from '../../core/models/rundown'
import { RundownCursor } from '../../core/models/rundown-cursor'
import { Segment } from '../../core/models/segment'
import { Part } from '../../core/models/part'

export class RundownNavigationService {
  public getRundownCursorForNearestValidSegmentBeforeSegmentMarkedAsNext(rundown: Rundown): RundownCursor {
    const nextSegmentIndex: number = this.getIndexForSegmentMarkedAsNext(rundown)
    const nearestValidSegment: Segment = this.getNearestValidSegmentBeforeSegmentIndex(rundown, nextSegmentIndex)
    const firstValidPart: Part = this.getFirstValidPartInSegment(nearestValidSegment)
    return {
      segmentId: firstValidPart.segmentId,
      partId: firstValidPart.id,
    }
  }

  private getIndexForSegmentMarkedAsNext(rundown: Rundown): number {
    const nextSegmentIndex: number = rundown.segments.findIndex(segment => segment.isNext)
    if (nextSegmentIndex < 0) {
      throw new Error('No next cursor is present in rundown.')
    }
    return nextSegmentIndex
  }

  private getNearestValidSegmentBeforeSegmentIndex(rundown: Rundown, segmentIndex: number): Segment {
    const nearestSegment: Segment | undefined = rundown.segments
      .slice(0, segmentIndex)
      .reverse()
      .find(segment => this.isValidSegment(segment))

    if (!nearestSegment) {
      throw new Error(`There are no valid segments before segment index ${segmentIndex} in rundown '${rundown.name}' with 'id ${rundown.id}'.`)
    }
    return nearestSegment
  }

  private isValidSegment(segment: Segment): boolean {
    return segment.parts.some(part => this.isValidPart(part))
  }

  private isValidPart(part: Part): boolean {
    return part.pieces.length !== 0 && !part.isOnAir
  }

  private getFirstValidPartInSegment(segment: Segment): Part {
    const validPart: Part | undefined = segment.parts.find(part => this.isValidPart(part))
    if (!validPart) {
      throw new Error(`Segment '${segment.name}' with id '${segment.id}' has no valid parts.`)
    }
    return validPart
  }

  public getRundownCursorForNearestValidSegmentAfterSegmentMarkedAsNext(rundown: Rundown): RundownCursor {
    const nextSegmentIndex: number = this.getIndexForSegmentMarkedAsNext(rundown)
    const nearestValidSegment: Segment = this.getNearestValidSegmentAfterSegmentIndex(rundown, nextSegmentIndex)
    const firstValidPart: Part = this.getFirstValidPartInSegment(nearestValidSegment)
    return {
      segmentId: firstValidPart.segmentId,
      partId: firstValidPart.id,
    }
  }

  private getNearestValidSegmentAfterSegmentIndex(rundown: Rundown, segmentIndex: number): Segment {
    const nearestSegment: Segment | undefined = rundown.segments.slice(segmentIndex + 1).find(segment => this.isValidSegment(segment))

    if (!nearestSegment) {
      throw new Error(`There are no valid segments after segment index ${segmentIndex} in rundown '${rundown.name}' with 'id ${rundown.id}'.`)
    }
    return nearestSegment
  }

  public getRundownCursorForNearestValidPartBeforePartMarkedAsNext(rundown: Rundown): RundownCursor {
    const nextSegmentIndex: number = this.getIndexForSegmentMarkedAsNext(rundown)
    const nextSegment: Segment = rundown.segments[nextSegmentIndex]
    const nextPartIndex: number = nextSegment.parts.findIndex(part => part.isNext)
    try {
      const nearestPart: Part = this.getNearestValidPartBeforePartIndex(nextSegment, nextPartIndex)
      return {
        segmentId: nearestPart.segmentId,
        partId: nearestPart.id,
      }
    } catch {}
    const nearestValidSegment: Segment = this.getNearestValidSegmentBeforeSegmentIndex(rundown, nextSegmentIndex)
    const lastValidPart: Part = this.getLastValidPartInSegment(nearestValidSegment)
    return {
      segmentId: lastValidPart.segmentId,
      partId: lastValidPart.id,
    }
  }

  private getNearestValidPartBeforePartIndex(segment: Segment, partIndex: number): Part {
    const nearestPart: Part | undefined = segment.parts
      .slice(0, partIndex)
      .reverse()
      .find(part => this.isValidPart(part))
    if (!nearestPart) {
      throw new Error(`There are no valid parts before part index ${partIndex} in segment '${segment.name}' with 'id ${segment.id}'.`)
    }
    return nearestPart
  }

  private getLastValidPartInSegment(segment: Segment): Part {
    const validPart: Part | undefined = [...segment.parts].reverse().find(part => this.isValidPart(part))
    if (!validPart) {
      throw new Error(`Segment '${segment.name}' with id '${segment.id}' has no valid parts.`)
    }
    return validPart
  }

  public getRundownCursorForNearestValidPartAfterPartMarkedAsNext(rundown: Rundown): RundownCursor {
    const nextSegmentIndex: number = this.getIndexForSegmentMarkedAsNext(rundown)
    const nextSegment: Segment = rundown.segments[nextSegmentIndex]
    const nextPartIndex: number = nextSegment.parts.findIndex(part => part.isNext)
    try {
      const nearestPart: Part = this.getNearestValidPartAfterPartIndex(nextSegment, nextPartIndex)
      return {
        segmentId: nearestPart.segmentId,
        partId: nearestPart.id,
      }
    } catch {}
    const nearestValidSegment: Segment = this.getNearestValidSegmentAfterSegmentIndex(rundown, nextSegmentIndex)
    const lastValidPart: Part = this.getFirstValidPartInSegment(nearestValidSegment)
    return {
      segmentId: lastValidPart.segmentId,
      partId: lastValidPart.id,
    }
  }

  private getNearestValidPartAfterPartIndex(segment: Segment, partIndex: number): Part {
    const nearestPart: Part | undefined = segment.parts.slice(partIndex + 1).find(part => this.isValidPart(part))
    if (!nearestPart) {
      throw new Error(`There are no valid parts before part index ${partIndex} in segment '${segment.name}' with 'id ${segment.id}'.`)
    }
    return nearestPart
  }
}
