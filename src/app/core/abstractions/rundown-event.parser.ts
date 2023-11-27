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
}
