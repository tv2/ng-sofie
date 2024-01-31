import { Segment } from '../../../core/models/segment'
import { Rundown } from '../../../core/models/rundown'
import { Logger } from '../../../core/abstractions/logger.service'
import { Tv2VideoClipAction } from '../../../shared/models/tv2-action'
import { CycleDirection } from '../../../core/models/cycle-direction'

export function isMiniShelf(segment: Segment): boolean {
  return <boolean>(segment.metadata?.miniShelfVideoClipFile && segment.isHidden)
}
export function getSegmentOnAir(runDown: Rundown): Segment | undefined {
  return runDown.segments.find(segment => segment.isOnAir)
}

export function getSegmentOnAirIndex(segmentOnAir: Segment | undefined, rundown: Rundown): number {
  if (!segmentOnAir) {
    return -1
  }
  return rundown.segments.indexOf(segmentOnAir)
}

export function canMiniShelvesBeCycled(rundown: Rundown, logger: Logger): boolean {
  if (!rundown.segments) {
    logger.debug('No Segments found')
    return false
  }
  if (rundown.segments.length <= 1) {
    logger.debug('Only one Segment found')
    return false
  }
  if (!getSegmentOnAir(rundown)) {
    logger.debug('No Segment On-Air found')
    return false
  }
  return true
}

export function cycleMiniShelves(
  direction: CycleDirection,
  rundown: Rundown,
  logger: Logger,
  currentMiniShelfTabIndex: number,
  miniShelfSegmentActionMappings: Record<string, Tv2VideoClipAction>
): [number, string | undefined] {
  let directionValue: number = 0
  directionValue = direction === CycleDirection.PREVIOUS ? -1 : directionValue
  directionValue = direction === CycleDirection.NEXT ? 1 : directionValue

  const segmentOnAirIndex = getSegmentOnAirIndex(getSegmentOnAir(rundown), rundown)
  const segmentsBellowSegmentOnAir: Segment[] = rundown.segments
    // look bellow the segment OnAir
    .filter((_, index) => index > segmentOnAirIndex)

  const firstNotMiniShelfSegmentBellow: Segment | undefined = segmentsBellowSegmentOnAir.find(segment => !isMiniShelf(segment))
  let cutMiniShelfGroupAtIndex: number = segmentsBellowSegmentOnAir.length - 1 // assume all are MiniShelves
  if (firstNotMiniShelfSegmentBellow) {
    // and update the above assumption to length
    cutMiniShelfGroupAtIndex = segmentsBellowSegmentOnAir.indexOf(firstNotMiniShelfSegmentBellow)
  }
  const miniShelves: Segment[] = segmentsBellowSegmentOnAir.filter((segment, index) => isMiniShelf(segment) && index < cutMiniShelfGroupAtIndex)
  if (miniShelves.length === 0) {
    logger.debug('No MiniShelves found bellow the running Segment')
    return [-1, undefined]
  }

  // this is the very first time we do cycle, and we should honor initially the directionValue
  currentMiniShelfTabIndex = currentMiniShelfTabIndex < 0 && direction === CycleDirection.PREVIOUS ? 0 : currentMiniShelfTabIndex

  // calculate
  let nextMiniShelfIndex = currentMiniShelfTabIndex + directionValue
  // and wrap on boundaries
  nextMiniShelfIndex = nextMiniShelfIndex < 0 ? miniShelves.length - 1 : nextMiniShelfIndex % miniShelves.length

  const nextActionId: string =
    // Record<string, Tv2VideoClipAction>[]
    miniShelfSegmentActionMappings[
      // Segment[]
      miniShelves[nextMiniShelfIndex].id // Segment
    ].id // Tv2VideoClipAction
  if (!nextActionId) {
    logger.debug('No next action found for MiniShelf')
    return [-1, undefined]
  }

  return [nextMiniShelfIndex, nextActionId]
}
