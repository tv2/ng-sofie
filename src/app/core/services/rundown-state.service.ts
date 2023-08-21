import { Inject, Injectable, OnDestroy, OnInit } from '@angular/core';
import { RundownEventService } from './rundown-event.service';
import { AdLibPieceInsertedRundownEvent, InfiniteRundownPieceAddedEvent, RundownEvent } from '../models/rundown-event';
import { RundownEventType } from '../models/rundown-event-type';
import { BehaviorSubject } from 'rxjs';
import { Rundown } from '../models/rundown';
import { RundownService } from './rundown.service';
import { Segment } from '../models/segment';
import { Part } from '../models/part';

@Injectable()
export class RundownStateService implements OnDestroy {
  private rundownSubject = new BehaviorSubject<Rundown | undefined>(undefined);

  rundown$ = this.rundownSubject.asObservable();
  private webSocket: WebSocket

  constructor(
    private rundownService: RundownService,
    private rundownEventService: RundownEventService,
    @Inject('rundownId') private rundownId: string
  ) {
    this.startListeningForRundownEvent(this.rundownId)
    this.fetchRundown(this.rundownId)
    window.onbeforeunload = () => this.ngOnDestroy()
  }

  // public initialize(rundownId: string) {
  //   // move here what currently the constructor does
  // }

  public ngOnDestroy(): void {
    this.webSocket.close()
  }

  private fetchRundown(rundownId: string): void {
    this.rundownService.fetchRundown(rundownId).subscribe(rundown => {
      this.rundownSubject.next(rundown)
      console.log(rundown)
    })
  }

  private insertAdLibPiece(event: AdLibPieceInsertedRundownEvent): void {
    const segment: Segment | undefined = this.rundownSubject.value?.segments.find(segment => segment.id === event.segmentId)
    if (!segment) {
      return
    }
    const part: Part | undefined = segment.parts.find(part => part.id === event.partId)
    if (!part) {
      return
    }
    part.insetAdLibPiece(event.adLibPiece)
  }

  private addInfiniteRundownPiece(event: InfiniteRundownPieceAddedEvent): void {
    this.rundownSubject.value?.addInfinitePiece(event.infinitePiece)
  }

  private startListeningForRundownEvent(rundownId: string): void {
    this.webSocket = this.rundownEventService.listenForRundownEvents(rundownId, (rundownEvent: RundownEvent) => {
      switch (rundownEvent.type) {
        case RundownEventType.ACTIVATE: {
          this.rundownSubject.value?.activate(rundownEvent)
          break
        }
        case RundownEventType.DEACTIVATE: {
          this.rundownSubject.value?.deactivate()
          break
        }
        case RundownEventType.RESET: {
          this.fetchRundown(rundownEvent.rundownId)
          break
        }
        case RundownEventType.TAKE: {
          this.rundownSubject.value?.takeNext(rundownEvent)
          break
        }
        case RundownEventType.SET_NEXT: {
          this.rundownSubject.value?.setNext(rundownEvent)
          break
        }
        case RundownEventType.AD_LIB_PIECE_INSERTED: {
          const adLibPieceInsertedEvent: AdLibPieceInsertedRundownEvent = rundownEvent as AdLibPieceInsertedRundownEvent
          this.insertAdLibPiece(adLibPieceInsertedEvent)
          break
        }
        case RundownEventType.INFINITE_RUNDOWN_PIECE_ADDED: {
          const infiniteRundownPieceAddedEvent: InfiniteRundownPieceAddedEvent = rundownEvent as InfiniteRundownPieceAddedEvent
          this.addInfiniteRundownPiece(infiniteRundownPieceAddedEvent)
          break;
        }
      }
    })
  }
}
