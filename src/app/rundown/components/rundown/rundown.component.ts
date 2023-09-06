import {Component, OnDestroy, OnInit} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {HttpRundownService} from '../../../core/services/http-rundown.service'
import {AdLibPieceService} from '../../../core/interfaces/ad-lib-piece-service.interface'
import {Rundown} from '../../../core/models/rundown';
import {Identifier} from '../../../core/models/identifier';
import { RundownStateService } from '../../../core/services/rundown-state.service';
import { SubscriptionLike } from 'rxjs'

@Component({
  selector: 'sofie-rundown',
  templateUrl: './rundown.component.html',
  styleUrls: ['./rundown.component.scss'],
})
export class RundownComponent implements OnInit, OnDestroy {

  public rundown?: Rundown
  public adLibPieceIdentifiers: Identifier[] = []
  private rundownSubscription?: SubscriptionLike

  constructor(
    private route: ActivatedRoute,
    private rundownService: HttpRundownService,
    private adLibPieceService: AdLibPieceService,
    private rundownStateService: RundownStateService
  ) { }

  public ngOnInit(): void {
    const rundownId: string | null = this.route.snapshot.paramMap.get('rundownId')
    if (!rundownId) {
      console.error('[error]: No rundownId found. Can\'t fetch Rundown')
      return
    }
    this.fetchAdLibPieceIdentifiers(rundownId)
    this.rundownStateService
        .subscribeToRundown(rundownId, (rundown) => { this.rundown = rundown })
        .then(unsubscribeFromRundown => { this.rundownSubscription = unsubscribeFromRundown })
  }

  public ngOnDestroy(): void {
    this.rundownSubscription?.unsubscribe()
  }

  private fetchAdLibPieceIdentifiers(rundownId: string): void {
    this.adLibPieceService.fetchAdLibPieceIdentifiers(rundownId).subscribe((identifiers: Identifier[]) => {
      this.adLibPieceIdentifiers = identifiers
    })
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

  public setNext(event: { segmentId: string, partId: string }): void {
    if (!this.rundown?.id) {
      return
    }
    this.rundownService.setNext(this.rundown.id, event.segmentId, event.partId).subscribe()
  }
}
