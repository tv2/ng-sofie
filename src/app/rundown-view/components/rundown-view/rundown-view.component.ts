import { Component, OnDestroy, OnInit } from '@angular/core'
import { Rundown } from '../../../core/models/rundown'
import { SubscriptionLike } from 'rxjs'
import { RundownStateService } from '../../../core/services/rundown-state.service'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'sofie-rundown-view',
  templateUrl: './rundown-view.component.html',
  styleUrls: ['./rundown-view.component.scss'],
})
export class RundownViewComponent implements OnInit, OnDestroy {
  public rundown?: Rundown
  private rundownSubscription?: SubscriptionLike

  constructor(
    private readonly route: ActivatedRoute,
    private readonly rundownStateService: RundownStateService
  ) {}

  public ngOnInit(): void {
    const rundownId: string | null = this.route.snapshot.paramMap.get('rundownId')
    if (!rundownId) {
      console.error("[error]: No rundownId found. Can't fetch Rundown")
      return
    }
    this.rundownStateService
      .subscribeToRundown(rundownId, rundown => {
        this.rundown = rundown
      })
      .then(unsubscribeFromRundown => {
        this.rundownSubscription = unsubscribeFromRundown
      })
      .catch(error => console.error(`[error] Failed subscribing to rundown with id '${rundownId}'.`, error))
  }

  public ngOnDestroy(): void {
    this.rundownSubscription?.unsubscribe()
  }
}
