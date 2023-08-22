import { Injectable } from '@angular/core';
import { RundownEventService } from './rundown-event.service';
import { AdLibPieceInsertedRundownEvent, InfiniteRundownPieceAddedEvent, RundownEvent } from '../models/rundown-event';
import { RundownEventType } from '../models/rundown-event-type';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Rundown } from '../models/rundown';
import { RundownService } from './rundown.service';
import { Segment } from '../models/segment';
import { Part } from '../models/part';

interface RundownSubjectInfo {
  rundownId: string
  subject: BehaviorSubject<Rundown | undefined>,
  subscriberCount: number
}

@Injectable()
export class RundownStateService {
  private subjectInfoMap: Map<string, RundownSubjectInfo> = new Map()

  constructor(
    private rundownService: RundownService,
    private rundownEventService: RundownEventService
  ) { }

  public subscribeToRundown(rundownId: string, callback: (rundown: Rundown | undefined) => void): () => void {
    let subjectInfo: RundownSubjectInfo | undefined = this.subjectInfoMap.get(rundownId)
    if (!subjectInfo) {
      subjectInfo = { rundownId, subject: new BehaviorSubject<Rundown | undefined>(undefined), subscriberCount: 0 }
      this.subjectInfoMap.set(rundownId, subjectInfo)
      this.fetchRundown(rundownId)
      this.startListeningForRundownEvent(rundownId)
    }
    subjectInfo.subscriberCount += 1
    const subscription = subjectInfo.subject.subscribe(callback)
    return () => this.unsubscribeFromSubject(subjectInfo!, subscription)
  }

  private unsubscribeFromSubject(subjectInfo: RundownSubjectInfo, subscription: Subscription) {
    subscription.unsubscribe()
    subjectInfo.subscriberCount -= 1
    if (subjectInfo.subscriberCount === 0) {
      this.subjectInfoMap.delete(subjectInfo.rundownId)
      this.stopListeningForRundownEvents(subjectInfo.rundownId)
    }
  }

  private fetchRundown(rundownId: string): void {
    this.rundownService.fetchRundown(rundownId).subscribe(rundown => {
      this.subjectInfoMap.get(rundownId)?.subject.next(rundown)
    })
  }

  private startListeningForRundownEvent(rundownId: string): void {
    this.rundownEventService.listenForRundownEvents(rundownId, (rundownEvent: RundownEvent) => {
      const rundownSubject = this.subjectInfoMap.get(rundownId)?.subject
      if (!rundownSubject) {
        return
      }
      switch (rundownEvent.type) {
        case RundownEventType.ACTIVATE: {
          rundownSubject.value?.activate(rundownEvent)
          break
        }
        case RundownEventType.DEACTIVATE: {
          rundownSubject.value?.deactivate()
          break
        }
        case RundownEventType.RESET: {
          this.fetchRundown(rundownEvent.rundownId)
          break
        }
        case RundownEventType.TAKE: {
          rundownSubject.value?.takeNext(rundownEvent)
          break
        }
        case RundownEventType.SET_NEXT: {
          rundownSubject.value?.setNext(rundownEvent)
          break
        }
        case RundownEventType.AD_LIB_PIECE_INSERTED: {
          const adLibPieceInsertedEvent: AdLibPieceInsertedRundownEvent = rundownEvent as AdLibPieceInsertedRundownEvent
          this.insertAdLibPiece(rundownSubject, adLibPieceInsertedEvent)
          break
        }
        case RundownEventType.INFINITE_RUNDOWN_PIECE_ADDED: {
          const infiniteRundownPieceAddedEvent: InfiniteRundownPieceAddedEvent = rundownEvent as InfiniteRundownPieceAddedEvent
          this.addInfiniteRundownPiece(rundownSubject, infiniteRundownPieceAddedEvent)
          break;
        }
      }
    })
  }

  private insertAdLibPiece(rundownSubject: BehaviorSubject<Rundown | undefined>, event: AdLibPieceInsertedRundownEvent): void {
    const segment: Segment | undefined = rundownSubject.value?.segments.find(segment => segment.id === event.segmentId)
    if (!segment) {
      return
    }
    const part: Part | undefined = segment.parts.find(part => part.id === event.partId)
    if (!part) {
      return
    }
    part.insetAdLibPiece(event.adLibPiece)
  }

  private addInfiniteRundownPiece(rundownSubject: BehaviorSubject<Rundown | undefined>, event: InfiniteRundownPieceAddedEvent): void {
    rundownSubject.value?.addInfinitePiece(event.infinitePiece)
  }

  private stopListeningForRundownEvents(_rundownId: string) {
    // TODO: Call appropriate method on rundownEventService or some callback to unsubscribe
  }
}
