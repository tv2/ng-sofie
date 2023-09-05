import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {RundownServiceInterface} from '../interfaces/rundown-service-interface';
import {MockRundownEventService} from './mock.rundown-event.service';
import {RundownEvent} from '../models/rundown-event';
import {RundownEventType} from '../models/rundown-event-type';
import {Rundown} from '../models/rundown';
import {MockDataService} from './mock.data.service';


@Injectable()
export class MockRundownService implements RundownServiceInterface {

  constructor(
    private eventService: MockRundownEventService,
    private dataService: MockDataService
  ) { }

  public fetchRundown(rundownId: string): Observable<Rundown> {
    return of(this.dataService.rundowns.find(rundown => rundown.id === rundownId)!)
  }

  public activate(rundownId: string): Observable<void> {
    const rundown: Rundown = this.dataService.rundowns.find(rundown => rundown.id === rundownId)!;
    this.dataService.currentSegment = rundown.segments[0];
    this.dataService.currentPart = this.dataService.currentSegment.parts[0]
    this.eventService.doMockEvent({
      type: RundownEventType.ACTIVATED,
      rundownId,
      segmentId: this.dataService.currentSegment.id,
      partId: this.dataService.currentPart.id
    } as RundownEvent)

    if (this.dataService.currentSegment.parts.length > 1) {
      this.setNext(rundownId, this.dataService.currentSegment.id, this.dataService.currentSegment.parts[1].id)
    } else {
      this.setNext(rundownId, rundown.segments[1].id, rundown.segments[1].parts[0].id)
    }

    return of()
  }

  public deactivate(rundownId: string): Observable<void> {
    this.eventService.doMockEvent({
      type: RundownEventType.DEACTIVATED,
      rundownId
    } as RundownEvent)
    return of();
  }

  public reset(rundownId: string): Observable<void> {
    this.deactivate(rundownId)
    this.activate(rundownId)
    return of();
  }

  public setNext(rundownId: string, segmentId: string, partId: string): Observable<void> {
    const rundown: Rundown = this.dataService.rundowns.find(rundown => rundown.id === rundownId)!;
    this.dataService.nextSegment = rundown.segments.find(segment => segment.id === segmentId)!
    this.dataService.nextPart = this.dataService.nextSegment.parts.find(part => part.id === partId)!

    this.eventService.doMockEvent({
      type: RundownEventType.SET_NEXT,
      rundownId,
      segmentId,
      partId
    } as RundownEvent)
    return of();
  }

  public takeNext(rundownId: string): Observable<void> {
    const rundown: Rundown = this.dataService.rundowns.find(rundown => rundown.id === rundownId)!;

    this.dataService.currentSegment = this.dataService.nextSegment
    this.dataService.currentPart = this.dataService.nextPart

    this.eventService.doMockEvent({
      type: RundownEventType.TAKEN,
      rundownId,
      segmentId: this.dataService.currentSegment.id,
      partId: this.dataService.currentPart.id
    } as RundownEvent)

    const isLastPartInSegment: boolean = this.dataService.currentSegment.parts.findIndex(part => part.id === this.dataService.currentPart.id) === (this.dataService.currentSegment.parts.length - 1)

    if (isLastPartInSegment) {
      const nextSegmentIndex: number = rundown.segments.findIndex(s => s.id === this.dataService.currentSegment.id) + 1
      this.setNext(rundownId, rundown.segments[nextSegmentIndex].id, rundown.segments[nextSegmentIndex].parts[0].id)
    } else {
      const nextPartIndex: number = this.dataService.currentSegment.parts.findIndex(part => part.id === this.dataService.currentPart.id) + 1
      this.setNext(rundownId, this.dataService.currentSegment.id, this.dataService.currentSegment.parts[nextPartIndex].id)
    }

    return of();
  }
}
