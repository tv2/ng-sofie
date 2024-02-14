import { Injectable } from '@angular/core'
import { Segment } from '../../core/models/segment'

@Injectable()
export class MiniShelfNavigationService {
  // Given a rundown and the current MiniShelf segment, it calculates what the next should be.
  constructor() {}

  public getNextMiniShelf(currentMiniShelf: Segment): Segment {
    return currentMiniShelf
  }

  public getPreviousMiniShelf(currentMiniShelf: Segment): Segment {
    return currentMiniShelf
  }
}
