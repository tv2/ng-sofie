import {Component, OnDestroy, OnInit} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {RundownService} from '../../../core/abstractions/rundown.service'
import {Rundown} from '../../../core/models/rundown'
import { RundownStateService } from '../../../core/services/rundown-state.service'
import { SubscriptionLike } from 'rxjs'
import { Segment } from '../../../core/models/segment'

@Component({
  selector: 'sofie-rundown',
  templateUrl: './rundown.component.html',
  styleUrls: ['./rundown.component.scss'],
})
export class RundownComponent implements OnInit, OnDestroy {

  public rundown?: Rundown
  private rundownSubscription?: SubscriptionLike

  constructor(
    private readonly route: ActivatedRoute,
    private readonly rundownService: RundownService,
    private readonly rundownStateService: RundownStateService
  ) { }

  public ngOnInit(): void {
    const rundownId: string | null = this.route.snapshot.paramMap.get('rundownId')
    if (!rundownId) {
      console.error('[error]: No rundownId found. Can\'t fetch Rundown')
      return
    }
    this.rundownStateService
      .subscribeToRundown(rundownId, (rundown) => { this.rundown = rundown })
      .then(unsubscribeFromRundown => { this.rundownSubscription = unsubscribeFromRundown })
      .catch(error => console.error(`[error] Failed subscribing to rundown with id '${rundownId}'.`, error))
  }

  public ngOnDestroy(): void {
    this.rundownSubscription?.unsubscribe()
  }

  public activateRundown(): void {
    if (!this.rundown?.id) {
      return
    }
    this.rundownService.activate(this.rundown.id).subscribe()
  }

  public deactivateRundown(): void {
    if (!this.rundown?.id) {
      return
    }
    this.rundownService.deactivate(this.rundown.id).subscribe()
  }

  public resetRundown(): void {
    if (!this.rundown?.id) {
      return
    }
    this.rundownService.reset(this.rundown.id).subscribe()
  }

  public takeNext(): void {
    if (!this.rundown?.id) {
      return
    }
    this.rundownService.takeNext(this.rundown.id).subscribe()
  }

  public trackSegment(_: number, segment: Segment): string {
    return segment.id
  }
}
