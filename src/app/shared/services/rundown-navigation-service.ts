import { Rundown } from '../../core/models/rundown'
import { RundownCursor } from '../../core/models/rundown-cursor'
import { Segment } from '../../core/models/segment'
import { Part } from '../../core/models/part'

/* TODO: Do we want it to go up/down if you go far enough left or right?
    Going too far left should put you at the last Part in the segment above */
export class RundownNavigationService {
  public getCursorForSegmentBeforeNext(rundown: Rundown): RundownCursor {
    const currentSegmentWithNext: Segment | undefined = rundown.segments.find(segment => segment.isNext)
    if (!currentSegmentWithNext) {
      return this.getFirstSegmentCursor(rundown)
    }

    const segmentAboveIndex: number = rundown.segments.indexOf(currentSegmentWithNext) - 1
    if (segmentAboveIndex < 0) {
      const currentNextPart: Part | undefined = currentSegmentWithNext.parts.find(part => part.isNext)
      return { segmentId: currentSegmentWithNext.id, partId: currentNextPart ? currentNextPart.id : currentSegmentWithNext.parts[0].id }
    }

    const firstValidPartAboveNext: Part = this.getFirstValidPartInSegmentBefore(rundown, rundown.segments[segmentAboveIndex])
    return { segmentId: firstValidPartAboveNext.segmentId, partId: firstValidPartAboveNext.id }
  }

  private getFirstSegmentCursor(rundown: Rundown): RundownCursor {
    const firstSegmentInRundown: Segment = rundown.segments[0]
    const firstValidPart: Part = this.getFirstValidPartInSegmentAfter(rundown, firstSegmentInRundown)
    return { segmentId: firstSegmentInRundown.id, partId: firstValidPart.id }
  }

  private getFirstValidPartInSegmentBefore(rundown: Rundown, segment: Segment): Part {
    const firstValidPart: Part | undefined = segment.parts.find(part => this.isValidPart(part))
    if (!firstValidPart) {
      const nextSegmentIndex = rundown.segments.indexOf(segment) - 1
      return this.getFirstValidPartInSegmentBefore(rundown, rundown.segments[nextSegmentIndex])
    }
    return firstValidPart
  }

  private isValidPart(part: Part): boolean {
    return part.pieces.length !== 0
  }

  public getCursorForSegmentAfterNext(rundown: Rundown): RundownCursor {
    const currentSegmentWithNext: Segment | undefined = rundown.segments.find(segment => segment.isNext)
    if (!currentSegmentWithNext) {
      return this.getFirstSegmentCursor(rundown)
    }
    const segmentBelowIndex: number = rundown.segments.indexOf(currentSegmentWithNext) + 1
    if (segmentBelowIndex > rundown.segments.length - 1) {
      const currentNextPart: Part | undefined = currentSegmentWithNext.parts.find(part => part.isNext)
      return { segmentId: currentSegmentWithNext.id, partId: currentNextPart ? currentNextPart.id : currentSegmentWithNext.parts[0].id }
    }
    const firstValidPartBelowNext: Part = this.getFirstValidPartInSegmentAfter(rundown, rundown.segments[segmentBelowIndex])
    return { segmentId: firstValidPartBelowNext.segmentId, partId: firstValidPartBelowNext.id }
  }

  private getFirstValidPartInSegmentAfter(rundown: Rundown, segment: Segment): Part {
    const firstValidPart: Part | undefined = segment.parts.find(part => this.isValidPart(part))
    if (!firstValidPart) {
      const nextSegmentIndex = rundown.segments.indexOf(segment) + 1
      return this.getFirstValidPartInSegmentAfter(rundown, rundown.segments[nextSegmentIndex])
    }
    return firstValidPart
  }

  public getCursorForEarlierPart(rundown: Rundown): RundownCursor {
    const currentSegmentWithNext: Segment | undefined = rundown.segments.find(segment => segment.isNext)
    if (!currentSegmentWithNext) {
      return this.getFirstSegmentCursor(rundown)
    }
    const firstValidPartLeftOfNext: Part = this.getFirstValidEarlierPart(rundown, currentSegmentWithNext)
    return { segmentId: firstValidPartLeftOfNext.segmentId, partId: firstValidPartLeftOfNext.id }
  }

  private getFirstValidEarlierPart(rundown: Rundown, segment: Segment): Part {
    const nextPart: Part | undefined = segment.parts.find(part => part.isNext)
    if (!nextPart) {
      return {} as Part
    }

    const firstValidPartLeftIndex: number = segment.parts.indexOf(nextPart) - 1
    if (firstValidPartLeftIndex < 0) {
      const segmentBeforeIndex: number = rundown.segments.indexOf(segment) - 1
      return this.getFirstValidPartInSegmentBefore(rundown, rundown.segments[segmentBeforeIndex])
    }

    return segment.parts[firstValidPartLeftIndex]
  }

  public getCursorForLaterPart(rundown: Rundown): RundownCursor {
    const currentSegmentWithNext: Segment | undefined = rundown.segments.find(segment => segment.isNext)
    if (!currentSegmentWithNext) {
      return this.getFirstSegmentCursor(rundown)
    }
    const firstValidPartRightOfNext: Part = this.getFirstValidLaterPart(rundown, currentSegmentWithNext)
    return { segmentId: firstValidPartRightOfNext.segmentId, partId: firstValidPartRightOfNext.id }
  }

  private getFirstValidLaterPart(rundown: Rundown, segment: Segment): Part {
    const nextPart: Part | undefined = segment.parts.find(part => part.isNext)
    if (!nextPart) {
      return {} as Part
    }

    const firstValidPartRightIndex: number = segment.parts.indexOf(nextPart) + 1
    if (firstValidPartRightIndex >= segment.parts.length) {
      const segmentBeforeIndex: number = rundown.segments.indexOf(segment) + 1
      return this.getFirstValidPartInSegmentAfter(rundown, rundown.segments[segmentBeforeIndex])
    }

    return segment.parts[firstValidPartRightIndex]
  }
}
