import { Injectable } from '@angular/core'
import { Segment } from '../../core/models/segment'
import { NewMiniShelfStateService } from './new-minishelf-state.service'

@Injectable()
export class MiniShelfNavigationService {
  // Given a rundown and the current MiniShelf segment, it calculates what the next should be.
  private miniShelfSegments: Segment[]

  constructor(private readonly newMiniShelfStateService: NewMiniShelfStateService) {
    this.newMiniShelfStateService.subscribeToMiniShelfSegments().subscribe(this.setMiniShelfSegments.bind(this))
  }

  private setMiniShelfSegments(miniShelfSegments: Segment[]): void {
    console.log('setMiniShelfSegments', miniShelfSegments)
    this.miniShelfSegments = miniShelfSegments
  }
  public getNextMiniShelf(currentMiniShelf: Segment): Segment {
    return currentMiniShelf
  }

  public getPreviousMiniShelf(currentMiniShelf: Segment): Segment {
    return currentMiniShelf
  }
}
