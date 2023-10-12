import { Component, OnDestroy, OnInit } from '@angular/core'
import { Rundown } from '../../../core/models/rundown'
import { SubscriptionLike } from 'rxjs'
import { RundownStateService } from '../../../core/services/rundown-state.service'
import { ActivatedRoute } from '@angular/router'
import { Logger } from '../../../core/abstractions/logger.service'

@Component({
  selector: 'sofie-rundown-view',
  templateUrl: './rundown-view.component.html',
  styleUrls: ['./rundown-view.component.scss'],
})
export class RundownViewComponent implements OnInit, OnDestroy {
  public rundown?: Rundown
  private rundownSubscription?: SubscriptionLike
  private readonly logger: Logger

  constructor(
    private readonly route: ActivatedRoute,
    private readonly rundownStateService: RundownStateService
  ) {}

  public ngOnInit(): void {
    const rundownId: string | null = this.route.snapshot.paramMap.get('rundownId')
    if (!rundownId) {
      this.logger.error("[error]: No rundownId found. Can't fetch Rundown")
      return
    }
    this.rundownStateService
      .subscribeToRundown(rundownId, rundown => {
        this.rundown = rundown
      })
      .then(rundownSubscription => {
        this.rundownSubscription = rundownSubscription
      })
      .catch(error => this.logger.data(error).error(`[error] Failed subscribing to rundown with id '${rundownId}'.`))
  }

  public ngOnDestroy(): void {
    this.rundownSubscription?.unsubscribe()
  }
}
