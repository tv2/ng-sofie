import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { Rundown } from '../../../core/models/rundown'
import { RundownStateService } from '../../../core/services/rundown-state.service'
import { SubscriptionLike } from 'rxjs'
import { Segment } from '../../../core/models/segment'
import { DialogService } from '../../../shared/services/dialog.service'

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

  @Input()
  public rundown?: Rundown
  private rundownSubscription?: SubscriptionLike

  constructor(
    private readonly rundownService: RundownService,
    private readonly rundownStateService: RundownStateService,
    private readonly dialogService: DialogService
  ) {}

  public ngOnInit(): void {
    if (!this.rundown?.id) {
      console.error("[error]: No rundownId found. Can't fetch Rundown")
      return
    }
    this.rundownStateService
      .subscribeToRundown(this.rundown?.id, rundown => {
        this.rundown = rundown
      })
      .then(unsubscribeFromRundown => {
        this.rundownSubscription = unsubscribeFromRundown
      })
      .catch(error => console.error(`[error] Failed subscribing to rundown with id '${this.rundown?.id}'.`, error))
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
