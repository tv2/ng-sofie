import { Injectable } from '@angular/core'
import {
  RundownInfinitePiecesUpdatedEvent,
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
export abstract class RundownEventValidator {
  public abstract validateRundownActivatedEvent(event: unknown): RundownActivatedEvent

  public abstract validateRundownDeactivatedEvent(event: unknown): RundownDeactivatedEvent

  public abstract validateRundownResetEvent(event: unknown): RundownResetEvent

  public abstract validateTakenEvent(event: unknown): PartTakenEvent

  public abstract validateSetNextEvent(event: unknown): PartSetAsNextEvent

  public abstract validateInfinitePiecesUpdatedEvent(event: unknown): RundownInfinitePiecesUpdatedEvent

  public abstract validatePartInsertedAsOnAirEvent(event: unknown): RundownPartInsertedAsOnAirEvent

  public abstract validatePartInsertedAsNextEvent(event: unknown): RundownPartInsertedAsNextEvent

  public abstract validatePieceInsertedEvent(event: unknown): RundownPieceInsertedEvent

  public abstract validateRundownCreatedEvent(event: unknown): RundownCreatedEvent

  public abstract validateRundownUpdatedEvent(event: unknown): RundownUpdatedEvent

  public abstract validateRundownDeletedEvent(event: unknown): RundownDeletedEvent

  public abstract validateSegmentCreatedEvent(event: unknown): SegmentCreatedEvent

  public abstract validateSegmentUpdatedEvent(event: unknown): SegmentUpdatedEvent

  public abstract validateSegmentDeletedEvent(event: unknown): SegmentDeletedEvent

  public abstract validateSegmentUnsyncedEvent(event: unknown): SegmentUnsyncedEvent

  public abstract validatePartCreatedEvent(event: unknown): PartCreatedEvent

  public abstract validatePartUpdatedEvent(event: unknown): PartUpdatedEvent

  public abstract validatePartDeletedEvent(event: unknown): PartDeletedEvent

  public abstract validatePartUnsyncedEvent(event: unknown): PartUnsyncedEvent
}
