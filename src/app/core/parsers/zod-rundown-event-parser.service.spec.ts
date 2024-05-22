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
import { EntityParser } from '../abstractions/entity-parser.service'
import { Piece } from '../models/piece'
import { TestEntityFactory } from '../../test/factories/test-entity.factory'
import { RundownTimingType } from '../enums/rundown-timing-type'
import { BasicRundown } from '../models/basic-rundown'
import { PieceLifespan } from '../models/piece-lifespan'
import { RundownMode } from '../enums/rundown-mode'

describe(ZodRundownEventParser.name, () => {
  describe(ZodRundownEventParser.prototype.parseRundownActivatedEvent.name, () => {
    it('parses a rundown activated event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: RundownActivatedEvent = {
        type: RundownEventType.ACTIVATED,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
      }

      const result = testee.parseRundownActivatedEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown activated event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownActivatedEvent> = {
        type: RundownEventType.ACTIVATED,
        rundownId: 'some-rundown-id',
      }

      const result = (): RundownActivatedEvent => testee.parseRundownActivatedEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.parseRundownDeactivatedEvent.name, () => {
    it('parses a rundown deactivated event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: RundownDeactivatedEvent = {
        type: RundownEventType.DEACTIVATED,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
      }

      const result = testee.parseRundownDeactivatedEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown deactivated event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownDeactivatedEvent> = {
        type: RundownEventType.DEACTIVATED,
      }

      const result = (): RundownDeactivatedEvent => testee.parseRundownDeactivatedEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.parseRundownResetEvent.name, () => {
    it('parses a rundown reset event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: RundownResetEvent = {
        type: RundownEventType.RESET,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
      }

      const result = testee.parseRundownResetEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown reset event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownResetEvent> = {
        type: RundownEventType.RESET,
      }

      const result = (): RundownResetEvent => testee.parseRundownResetEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.parseTakenEvent.name, () => {
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

      const result = testee.parseTakenEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown taken event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<PartTakenEvent> = {
        type: RundownEventType.TAKEN,
      }

      const result = (): PartTakenEvent => testee.parseTakenEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.parseSetNextEvent.name, () => {
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

      const result = testee.parseSetNextEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown set next event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<PartSetAsNextEvent> = {
        type: RundownEventType.SET_NEXT,
      }

      const result = (): PartSetAsNextEvent => testee.parseSetNextEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.parseInfinitePiecesUpdatedEvent.name, () => {
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
            lifespan: PieceLifespan.WITHIN_PART,
          },
          {
            id: 'some-other-piece-id',
            name: 'some--other-piece',
            partId: 'some-other-part-id',
            layer: 'some-lother-ayer',
            start: 0,
            isPlanned: false,
            lifespan: PieceLifespan.WITHIN_PART,
          },
        ],
      }

      const result = testee.parseInfinitePiecesUpdatedEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown infinite piece updated event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownInfinitePiecesUpdatedEvent> = {
        type: RundownEventType.INFINITE_PIECES_UPDATED,
        rundownId: 'some-rundown-id',
      }

      const result = (): RundownInfinitePiecesUpdatedEvent => testee.parseInfinitePiecesUpdatedEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.parsePartInsertedAsOnAirEvent.name, () => {
    it('parses a rundown part is inserted as on-air event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      when(mockedEntityParser.parsePart(anything())).thenCall(part => part)
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
          replacedPieces: [],
        },
      }

      const result: RundownPartInsertedAsOnAirEvent = testee.parsePartInsertedAsOnAirEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown part is inserted as on-air event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownPartInsertedAsOnAirEvent> = {
        type: RundownEventType.PART_INSERTED_AS_ON_AIR,
        rundownId: 'some-rundown-id',
      }

      const result = (): RundownPartInsertedAsOnAirEvent => testee.parsePartInsertedAsOnAirEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.parsePartInsertedAsNextEvent.name, () => {
    it('parses a rundown part is inserted as next event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      when(mockedEntityParser.parsePart(anything())).thenCall(part => part)
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
          replacedPieces: [],
        },
      }

      const result: RundownPartInsertedAsNextEvent = testee.parsePartInsertedAsNextEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown part is inserted as next event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownPartInsertedAsNextEvent> = {
        type: RundownEventType.PART_INSERTED_AS_NEXT,
        rundownId: 'some-rundown-id',
      }

      const result = (): RundownPartInsertedAsNextEvent => testee.parsePartInsertedAsNextEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.parsePieceInsertedEvent.name, () => {
    it('parses a rundown piece is inserted event', () => {
      const piece: Piece = TestEntityFactory.createPiece()
      const mockedEntityParser = createMockOfEntityParser()
      when(mockedEntityParser.parsePart(anything())).thenCall(part => part)
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: RundownPieceInsertedEvent = {
        type: RundownEventType.PIECE_INSERTED,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
        segmentId: 'some-segment-id',
        partId: 'some-part-id',
        piece,
      }

      const result: RundownPieceInsertedEvent = testee.parsePieceInsertedEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown piece is inserted event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownPieceInsertedEvent> = {
        type: RundownEventType.PIECE_INSERTED,
        rundownId: 'some-rundown-id',
      }

      const result = (): RundownPieceInsertedEvent => testee.parsePieceInsertedEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.parseRundownCreatedEvent.name, () => {
    it('parses a rundown created event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const basicRundown: BasicRundown = {
        id: 'rundownId',
        name: 'RundownName',
        mode: RundownMode.INACTIVE,
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

      const result = testee.parseRundownCreatedEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown created event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownCreatedEvent> = {
        type: RundownEventType.RUNDOWN_CREATED,
      }

      const result = (): RundownCreatedEvent => testee.parseRundownCreatedEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.parseRundownUpdatedEvent.name, () => {
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
          mode: RundownMode.INACTIVE,
          modifiedAt: Date.now(),
          timing: {
            type: RundownTimingType.UNSCHEDULED,
          },
        },
      }

      const result = testee.parseRundownUpdatedEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown updated event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownUpdatedEvent> = {
        type: RundownEventType.RUNDOWN_UPDATED,
      }

      const result = (): RundownUpdatedEvent => testee.parseRundownUpdatedEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.parseRundownDeletedEvent.name, () => {
    it('parses a rundown deleted event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: RundownDeletedEvent = {
        type: RundownEventType.RUNDOWN_DELETED,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
      }

      const result = testee.parseRundownDeletedEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown deleted event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownDeletedEvent> = {
        type: RundownEventType.RUNDOWN_DELETED,
      }

      const result = (): RundownDeletedEvent => testee.parseRundownDeletedEvent(event)

      expect(result).toThrow()
    })
  })
})

function createMockOfEntityParser(): EntityParser {
  const mockedEntityParser = mock<EntityParser>()
  when(mockedEntityParser.parsePiece(anything())).thenCall(piece => piece)
  when(mockedEntityParser.parseBasicRundown(anything())).thenCall(basicRundown => basicRundown)
  when(mockedEntityParser.parseRundown(anything())).thenCall(rundown => rundown)
  return mockedEntityParser
}
