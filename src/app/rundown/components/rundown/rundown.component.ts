import {Component, Inject, OnInit} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {RundownService} from '../../../core/services/rundown.service'
import {AdLibPieceService} from '../../../core/services/ad-lib-piece.service'
import {Rundown} from '../../../core/models/rundown';
import {Identifier} from '../../../core/models/identifier';
import {RundownEventService} from '../../../core/services/rundown-event.service';
import { RundownStateService } from '../../../core/services/rundown-state.service';

@Component({
  selector: 'sofie-rundown',
  templateUrl: './rundown.component.html',
  styleUrls: ['./rundown.component.scss'],
  providers: [
    // {
    //   provide: RundownStateService,
    //   useFactory: (rundownService: RundownService, rundownEventService: RundownEventService, route: ActivatedRoute) => {
    //     const rundownId = route.snapshot.paramMap.get('rundownId');
    //     if (!rundownId) {
    //       return
    //     }
    //     return new RundownStateService(rundownService, rundownEventService, rundownId);
    //   },
    //   deps: [RundownService, RundownEventService, ActivatedRoute],
    // },
    {
      provide: 'rundownId',
      useFactory: (route: ActivatedRoute) => {
        console.log(route);
        return route.snapshot.paramMap.get('rundownId')
      },
      deps: [ActivatedRoute]
    },
    RundownStateService,
  ],
})
export class RundownComponent implements OnInit {

  public rundown?: Rundown
  public adLibPieceIdentifiers: Identifier[] = []

  constructor(
    private rundownService: RundownService,
    private adLibPieceService: AdLibPieceService,
    private rundownStateService: RundownStateService,
    @Inject('rundownId') private rundownId: string
  ) { }

  public ngOnInit(): void {
    if (!this.rundownId) {
      console.log('No rundownId found. Can\'t fetch Rundown')
      return
    }
    this.fetchAdLibPieceIdentifiers(this.rundownId)
    this.rundownStateService.rundown$.subscribe((rundown) => {
      this.rundown = rundown;
    });
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
