import { Segment } from '../../../core/models/segment'
import { Rundown } from '../../../core/models/rundown'
import { Logger } from '../../../core/abstractions/logger.service'
import { ActionStateService } from '../../../shared/services/action-state.service'
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
  actionStateService: ActionStateService,
  currentMiniShelfIndex: number,
  miniShelfSegmentActionMappings: Record<string, Tv2VideoClipAction>
): number {
  let directionValue: number = 0
  if (direction === CycleDirection.PREVIOUS) {
    directionValue = -1
  }
  if (direction === CycleDirection.NEXT) {
    directionValue = 1
  }
  const segmentOnAirIndex = getSegmentOnAirIndex(getSegmentOnAir(rundown), rundown)
  const segmentsBellowSegmentOnAir: Segment[] = rundown.segments
    // look bellow the segment OnAir
    .filter(segment => rundown.segments.indexOf(segment) > segmentOnAirIndex)

  const firstNotMiniShelfSegmentBellow: Segment | undefined = segmentsBellowSegmentOnAir.find(segment => !isMiniShelf(segment))
  let cutMiniShelfGroupAtIndex: number = segmentsBellowSegmentOnAir.length - 1 // assume all are MiniShelves
  if (firstNotMiniShelfSegmentBellow) {
    // and update the above assumption to length
    cutMiniShelfGroupAtIndex = segmentsBellowSegmentOnAir.indexOf(firstNotMiniShelfSegmentBellow)
  }
  const miniShelves: Segment[] = segmentsBellowSegmentOnAir.filter((segment, index) => isMiniShelf(segment) && index < cutMiniShelfGroupAtIndex)
  if (miniShelves.length === 0) {
    logger.debug('No MiniShelves found bellow the running Segment')
    return -1
  }

  // this is the very first time we do cycle, and we should honor initially the directionValue
  if (currentMiniShelfIndex < 0 && direction === CycleDirection.PREVIOUS) {
    currentMiniShelfIndex = 0 // and re-adjust the default value
  }

  // calculate
  let miniShelfIndex = currentMiniShelfIndex + directionValue
  // and wrap on boundaries
  if (miniShelfIndex < 0) {
    miniShelfIndex = miniShelves.length - 1
  } else if (miniShelfIndex >= miniShelves.length) {
    miniShelfIndex = 0
  }

  const tabActionSegment: Segment = miniShelves[miniShelfIndex]
  const nextAction: Tv2VideoClipAction = miniShelfSegmentActionMappings[tabActionSegment.id]
  if (!nextAction) {
    logger.debug('No next action found for MiniShelf')
    return -1
  }
  // finally set and execute
  currentMiniShelfIndex = miniShelfIndex
  actionStateService.executeAction(nextAction.id, rundown.id)
  return currentMiniShelfIndex
}
