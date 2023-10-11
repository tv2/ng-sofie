import { Component, HostListener, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { Rundown } from '../../../core/models/rundown'
import { RundownStateService } from '../../../core/services/rundown-state.service'
import { SubscriptionLike } from 'rxjs'
import { Segment } from '../../../core/models/segment'
import { DialogService } from '../../../shared/services/dialog.service'
import { Logger } from '../../../core/abstractions/logger.service'

@Component({
  selector: 'sofie-rundown',
  templateUrl: './rundown.component.html',
  styleUrls: ['./rundown.component.scss'],
})
export class RundownComponent implements OnInit, OnDestroy {
  //TODO: Remove this temporary implementation once keyboard shortcuts are added
  @HostListener('document:keypress', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.code === 'Backquote') {
      this.openActivationDialog()
    }
  }

  public rundown?: Rundown
  private rundownSubscription?: SubscriptionLike
  private readonly logger: Logger

  constructor(
    private readonly route: ActivatedRoute,
    private readonly rundownService: RundownService,
    private readonly rundownStateService: RundownStateService,
    private readonly dialogService: DialogService,
    logger: Logger
  ) {
    this.logger = logger.tag('RundownComponent')
  }

  public ngOnInit(): void {
    const rundownId: string | null = this.route.snapshot.paramMap.get('rundownId')
    if (!rundownId) {
      this.logger.error("No rundownId found. Can't fetch Rundown")
      return
    }
    this.rundownStateService
      .subscribeToRundown(rundownId, rundown => {
        this.rundown = rundown
      })
      .then(unsubscribeFromRundown => {
        this.rundownSubscription = unsubscribeFromRundown
      })
      .catch(error => this.logger.data(error).error(`[error] Failed subscribing to rundown with id '${rundownId}'.`))
  }

  public ngOnDestroy(): void {
    this.rundownSubscription?.unsubscribe()
  }

  public openActivationDialog(): void {
    if (!this.rundown || this.rundown.isActive) {
      return
    }
    this.dialogService.createConfirmDialog(this.rundown.name, `Are you sure you want to activate the Rundown?`, 'Activate', () => this.activateRundown())
  }

  public activateRundown(): void {
    if (!this.rundown?.id) {
      return
    }
    this.rundownService.activate(this.rundown.id).subscribe()
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
