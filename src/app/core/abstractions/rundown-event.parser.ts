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
    PartCreatedEvent,
    PartUpdatedEvent,
    PartDeletedEvent,
    SegmentUpdatedEvent,
    SegmentDeletedEvent, SegmentCreatedEvent, RundownUpdatedEvent, RundownCreatedEvent,
} from '../models/rundown-event'

@Injectable()
export abstract class RundownEventParser {
  public abstract parseActivatedEvent(maybeEvent: unknown): RundownActivatedEvent

  public abstract parseDeactivatedEvent(maybeEvent: unknown): RundownDeactivatedEvent

  public abstract parseResetEvent(maybeEvent: unknown): RundownResetEvent

  public abstract parseTakenEvent(maybeEvent: unknown): PartTakenEvent

  public abstract parseSetNextEvent(maybeEvent: unknown): PartSetAsNextEvent

  public abstract parseInfinitePieceAddedEvent(maybeEvent: unknown): RundownInfinitePieceAddedEvent

  public abstract parsePartInsertedAsOnAirEvent(maybeEvent: unknown): RundownPartInsertedAsOnAirEvent

  public abstract parsePartInsertedAsNextEvent(maybeEvent: unknown): RundownPartInsertedAsNextEvent

  public abstract parsePieceInsertedEvent(maybeEvent: unknown): RundownPieceInsertedEvent

    public abstract parseRundownCreatedEvent(maybeEvent: unknown): RundownCreatedEvent
    public abstract parseRundownUpdatedEvent(maybeEvent: unknown): RundownUpdatedEvent
    public abstract parseRundownDeletedEvent(maybeEvent: unknown): RundownDeletedEvent
    public abstract parseSegmentCreatedEvent(maybeEvent: unknown): SegmentCreatedEvent
    public abstract parseSegmentUpdatedEvent(maybeEvent: unknown): SegmentUpdatedEvent
    public abstract parseSegmentDeletedEvent(maybeEvent: unknown): SegmentDeletedEvent
    public abstract parsePartCreatedEvent(maybeEvent: unknown): PartCreatedEvent
    public abstract parsePartUpdatedEvent(maybeEvent: unknown): PartUpdatedEvent
    public abstract parsePartDeletedEvent(maybeEvent: unknown): PartDeletedEvent
}
