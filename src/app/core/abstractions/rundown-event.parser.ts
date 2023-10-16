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
  RundownPartInsertedAsNextEvent, RundownPieceInsertedEvent,
} from '../models/rundown-event'

@Injectable()
export abstract class RundownEventParser {
  public abstract parseActivatedEvent(maybeEvent: unknown): RundownActivatedEvent

  public abstract parseDeactivatedEvent(maybeEvent: unknown): RundownDeactivatedEvent

  public abstract parseDeletedEvent(maybeEvent: unknown): RundownDeletedEvent

  public abstract parseResetEvent(maybeEvent: unknown): RundownResetEvent

  public abstract parseTakenEvent(maybeEvent: unknown): PartTakenEvent

  public abstract parseSetNextEvent(maybeEvent: unknown): PartSetAsNextEvent

  public abstract parseInfinitePieceAddedEvent(maybeEvent: unknown): RundownInfinitePieceAddedEvent

  public abstract parsePartInsertedAsOnAirEvent(maybeEvent: unknown): RundownPartInsertedAsOnAirEvent

  public abstract parsePartInsertedAsNextEvent(maybeEvent: unknown): RundownPartInsertedAsNextEvent

  public abstract parsePieceInsertedEvent(maybeEvent: unknown): RundownPieceInsertedEvent
}
