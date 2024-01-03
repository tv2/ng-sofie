import { ZodRundownEventParser } from './zod-rundown-event-parser.service'
import { RundownEventType } from '../models/rundown-event-type'
import { anything, instance, mock, when } from '@typestrong/ts-mockito'
import {
  PartSetAsNextEvent,
  PartTakenEvent,
  RundownActivatedEvent,
  RundownCreatedEvent,
  RundownDeactivatedEvent,
  RundownDeletedEvent,
  RundownInfinitePiecesUpdatedEvent,
  RundownPartInsertedAsNextEvent,
  RundownPartInsertedAsOnAirEvent,
  RundownPieceInsertedEvent,
  RundownResetEvent,
  RundownUpdatedEvent,
} from '../models/rundown-event'
import { EntityValidator } from '../abstractions/entity-parser.service'
import { Piece } from '../models/piece'
import { TestEntityFactory } from '../../test/factories/test-entity.factory'
import { RundownTimingType } from '../enums/rundown-timing-type'
import { BasicRundown } from '../models/basic-rundown'

describe(ZodRundownEventParser.name, () => {
  describe(ZodRundownEventParser.prototype.validateRundownActivatedEvent.name, () => {
    it('parses a rundown activated event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: RundownActivatedEvent = {
        type: RundownEventType.ACTIVATED,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
      }

      const result = testee.validateRundownActivatedEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown activated event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownActivatedEvent> = {
        type: RundownEventType.ACTIVATED,
        rundownId: 'some-rundown-id',
      }

      const result = (): RundownActivatedEvent => testee.validateRundownActivatedEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.validateRundownDeactivatedEvent.name, () => {
    it('parses a rundown deactivated event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: RundownDeactivatedEvent = {
        type: RundownEventType.DEACTIVATED,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
      }

      const result = testee.validateRundownDeactivatedEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown deactivated event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownDeactivatedEvent> = {
        type: RundownEventType.DEACTIVATED,
      }

      const result = (): RundownDeactivatedEvent => testee.validateRundownDeactivatedEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.validateRundownResetEvent.name, () => {
    it('parses a rundown reset event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: RundownResetEvent = {
        type: RundownEventType.RESET,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
      }

      const result = testee.validateRundownResetEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown reset event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownResetEvent> = {
        type: RundownEventType.RESET,
      }

      const result = (): RundownResetEvent => testee.validateRundownResetEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.validateTakenEvent.name, () => {
    it('parses a rundown taken event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: PartTakenEvent = {
        type: RundownEventType.TAKEN,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
        segmentId: 'some-segment-id',
        partId: 'some-part-id',
      }

      const result = testee.validateTakenEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown taken event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<PartTakenEvent> = {
        type: RundownEventType.TAKEN,
      }

      const result = (): PartTakenEvent => testee.validateTakenEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.validateSetNextEvent.name, () => {
    it('parses a rundown set next event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: PartSetAsNextEvent = {
        type: RundownEventType.SET_NEXT,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
        segmentId: 'some-segment-id',
        partId: 'some-part-id',
      }

      const result = testee.validateSetNextEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown set next event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<PartSetAsNextEvent> = {
        type: RundownEventType.SET_NEXT,
      }

      const result = (): PartSetAsNextEvent => testee.validateSetNextEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.validateInfinitePiecesUpdatedEvent.name, () => {
    it('parses a rundown infinite pieces updated event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: RundownInfinitePiecesUpdatedEvent = {
        type: RundownEventType.INFINITE_PIECES_UPDATED,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
        infinitePieces: [
          {
            id: 'some-piece-id',
            name: 'some-piece',
            partId: 'some-part-id',
            layer: 'some-layer',
            start: 0,
            isPlanned: false,
          },
          {
            id: 'some-other-piece-id',
            name: 'some--other-piece',
            partId: 'some-other-part-id',
            layer: 'some-lother-ayer',
            start: 0,
            isPlanned: false,
          },
        ],
      }

      const result = testee.validateInfinitePiecesUpdatedEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown infinite piece updated event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownInfinitePiecesUpdatedEvent> = {
        type: RundownEventType.INFINITE_PIECES_UPDATED,
        rundownId: 'some-rundown-id',
      }

      const result = (): RundownInfinitePiecesUpdatedEvent => testee.validateInfinitePiecesUpdatedEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.validatePartInsertedAsOnAirEvent.name, () => {
    it('parses a rundown part is inserted as on-air event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      when(mockedEntityParser.validatePart(anything())).thenCall(part => part)
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: RundownPartInsertedAsOnAirEvent = {
        type: RundownEventType.PART_INSERTED_AS_ON_AIR,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
        part: {
          executedAt: 0,
          id: '',
          rank: 1,
          isNext: false,
          isOnAir: false,
          pieces: [],
          playedDuration: 0,
          segmentId: '',
          isPlanned: false,
          isUntimed: false,
          isUnsynced: false,
        },
      }

      const result: RundownPartInsertedAsOnAirEvent = testee.validatePartInsertedAsOnAirEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown part is inserted as on-air event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownPartInsertedAsOnAirEvent> = {
        type: RundownEventType.PART_INSERTED_AS_ON_AIR,
        rundownId: 'some-rundown-id',
      }

      const result = (): RundownPartInsertedAsOnAirEvent => testee.validatePartInsertedAsOnAirEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.validatePartInsertedAsNextEvent.name, () => {
    it('parses a rundown part is inserted as next event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      when(mockedEntityParser.validatePart(anything())).thenCall(part => part)
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: RundownPartInsertedAsNextEvent = {
        type: RundownEventType.PART_INSERTED_AS_NEXT,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
        part: {
          executedAt: 0,
          id: '',
          rank: 1,
          isNext: false,
          isOnAir: false,
          pieces: [],
          playedDuration: 0,
          segmentId: '',
          isPlanned: false,
          isUntimed: false,
          isUnsynced: false,
        },
      }

      const result: RundownPartInsertedAsNextEvent = testee.validatePartInsertedAsNextEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown part is inserted as next event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownPartInsertedAsNextEvent> = {
        type: RundownEventType.PART_INSERTED_AS_NEXT,
        rundownId: 'some-rundown-id',
      }

      const result = (): RundownPartInsertedAsNextEvent => testee.validatePartInsertedAsNextEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.validatePieceInsertedEvent.name, () => {
    it('parses a rundown piece is inserted event', () => {
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const piece: Piece = testEntityFactory.createPiece()
      const mockedEntityParser = createMockOfEntityParser()
      when(mockedEntityParser.validatePart(anything())).thenCall(part => part)
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: RundownPieceInsertedEvent = {
        type: RundownEventType.PIECE_INSERTED,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
        segmentId: 'some-segment-id',
        partId: 'some-part-id',
        piece,
      }

      const result: RundownPieceInsertedEvent = testee.validatePieceInsertedEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown piece is inserted event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownPieceInsertedEvent> = {
        type: RundownEventType.PIECE_INSERTED,
        rundownId: 'some-rundown-id',
      }

      const result = (): RundownPieceInsertedEvent => testee.validatePieceInsertedEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.validateRundownCreatedEvent.name, () => {
    it('parses a rundown created event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const basicRundown: BasicRundown = {
        id: 'rundownId',
        name: 'RundownName',
        isActive: false,
        modifiedAt: Date.now(),
        timing: {
          type: RundownTimingType.UNSCHEDULED,
        },
      }
      const event: RundownCreatedEvent = {
        type: RundownEventType.RUNDOWN_CREATED,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
        rundown: {
          ...basicRundown,
          segments: [],
          infinitePieces: [],
        },
      }

      const result = testee.validateRundownCreatedEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown created event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownCreatedEvent> = {
        type: RundownEventType.RUNDOWN_CREATED,
      }

      const result = (): RundownCreatedEvent => testee.validateRundownCreatedEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.validateRundownUpdatedEvent.name, () => {
    it('parses a rundown updated event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: RundownUpdatedEvent = {
        type: RundownEventType.RUNDOWN_UPDATED,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
        basicRundown: {
          id: 'rundownId',
          name: 'RundownName',
          isActive: false,
          modifiedAt: Date.now(),
          timing: {
            type: RundownTimingType.UNSCHEDULED,
          },
        },
      }

      const result = testee.validateRundownUpdatedEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown updated event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownUpdatedEvent> = {
        type: RundownEventType.RUNDOWN_UPDATED,
      }

      const result = (): RundownUpdatedEvent => testee.validateRundownUpdatedEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.validateRundownDeletedEvent.name, () => {
    it('parses a rundown deleted event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: RundownDeletedEvent = {
        type: RundownEventType.RUNDOWN_DELETED,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
      }

      const result = testee.validateRundownDeletedEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown deleted event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownDeletedEvent> = {
        type: RundownEventType.RUNDOWN_DELETED,
      }

      const result = (): RundownDeletedEvent => testee.validateRundownDeletedEvent(event)

      expect(result).toThrow()
    })
  })
})

function createMockOfEntityParser(): EntityValidator {
  const mockedEntityParser = mock<EntityValidator>()
  when(mockedEntityParser.validatePiece(anything())).thenCall(piece => piece)
  when(mockedEntityParser.validateBasicRundown(anything())).thenCall(basicRundown => basicRundown)
  when(mockedEntityParser.validateRundown(anything())).thenCall(rundown => rundown)
  return mockedEntityParser
}
