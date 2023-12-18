import { Injectable } from '@angular/core'
import {
  RundownInfinitePieceAddedEvent,
  RundownActivatedEvent,
  RundownDeactivatedEvent,
  RundownResetEvent,
  PartSetAsNextEvent,
  PartTakenEvent,
  RundownDeletedEvent,
  RundownPartInsertedAsOnAirEvent,
  RundownPartInsertedAsNextEvent,
  RundownPieceInsertedEvent,
  RundownCreatedEvent,
  RundownUpdatedEvent,
  SegmentUpdatedEvent,
  SegmentDeletedEvent,
  PartCreatedEvent,
  PartDeletedEvent,
  SegmentCreatedEvent,
  PartUpdatedEvent,
  SegmentUnsyncedEvent,
  PartUnsyncedEvent,
} from '../models/rundown-event'

@Injectable()
export abstract class RundownEventParser {
  public abstract parseRundownActivatedEvent(event: unknown): RundownActivatedEvent

  public abstract parseRundownDeactivatedEvent(event: unknown): RundownDeactivatedEvent

  public abstract parseRundownResetEvent(event: unknown): RundownResetEvent

  public abstract parseTakenEvent(event: unknown): PartTakenEvent

  public abstract parseSetNextEvent(event: unknown): PartSetAsNextEvent

  public abstract parseInfinitePieceAddedEvent(event: unknown): RundownInfinitePieceAddedEvent

  public abstract parsePartInsertedAsOnAirEvent(event: unknown): RundownPartInsertedAsOnAirEvent

  public abstract parsePartInsertedAsNextEvent(event: unknown): RundownPartInsertedAsNextEvent

  public abstract parsePieceInsertedEvent(event: unknown): RundownPieceInsertedEvent

  public abstract parseRundownCreatedEvent(event: unknown): RundownCreatedEvent

  public abstract parseRundownUpdatedEvent(event: unknown): RundownUpdatedEvent

  public abstract parseRundownDeletedEvent(event: unknown): RundownDeletedEvent

  public abstract parseSegmentCreatedEvent(event: unknown): SegmentCreatedEvent

  public abstract parseSegmentUpdatedEvent(event: unknown): SegmentUpdatedEvent

  public abstract parseSegmentDeletedEvent(event: unknown): SegmentDeletedEvent

  public abstract parseSegmentUnsyncedEvent(event: unknown): SegmentUnsyncedEvent

  public abstract parsePartCreatedEvent(event: unknown): PartCreatedEvent

  public abstract parsePartUpdatedEvent(event: unknown): PartUpdatedEvent

  public abstract parsePartDeletedEvent(event: unknown): PartDeletedEvent

  public abstract parsePartUnsyncedEvent(event: unknown): PartUnsyncedEvent
}
