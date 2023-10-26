import { ZodRundownEventParser } from './zod-rundown-event-parser.service'
import { RundownEventType } from '../models/rundown-event-type'
import { anything, instance, mock, when } from '@typestrong/ts-mockito'
import {
  PartSetAsNextEvent,
  PartTakenEvent,
  RundownActivatedEvent,
  RundownDeactivatedEvent,
  RundownDeletedEvent,
  RundownInfinitePieceAddedEvent,
  RundownPartInsertedAsNextEvent,
  RundownPartInsertedAsOnAirEvent,
  RundownPieceInsertedEvent,
  RundownResetEvent,
} from '../models/rundown-event'
import { EntityParser } from '../abstractions/entity-parser.service'
import { TestEntityFactory } from '../services/models/test-entity.factory'
import { Piece } from '../models/piece'

describe(ZodRundownEventParser.name, () => {
  describe(ZodRundownEventParser.prototype.parseActivatedEvent.name, () => {
    it('parses a rundown activated event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: RundownActivatedEvent = {
        type: RundownEventType.ACTIVATED,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
      }

      const result = testee.parseActivatedEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown activated event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownActivatedEvent> = {
        type: RundownEventType.ACTIVATED,
        rundownId: 'some-rundown-id',
      }

      const result = (): RundownActivatedEvent => testee.parseActivatedEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.parseDeactivatedEvent.name, () => {
    it('parses a rundown deactivated event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: RundownDeactivatedEvent = {
        type: RundownEventType.DEACTIVATED,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
      }

      const result = testee.parseDeactivatedEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown deactivated event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownDeactivatedEvent> = {
        type: RundownEventType.DEACTIVATED,
      }

      const result = (): RundownDeactivatedEvent => testee.parseDeactivatedEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.parseDeletedEvent.name, () => {
    it('parses a rundown deleted event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: RundownDeletedEvent = {
        type: RundownEventType.DELETED,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
      }

      const result = testee.parseDeletedEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown deleted event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownDeletedEvent> = {
        type: RundownEventType.DELETED,
      }

      const result = (): RundownDeletedEvent => testee.parseDeletedEvent(event)

      expect(result).toThrow()
    })
  })

  describe(ZodRundownEventParser.prototype.parseResetEvent.name, () => {
    it('parses a rundown reset event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: RundownResetEvent = {
        type: RundownEventType.RESET,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
      }

      const result = testee.parseResetEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown reset event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownResetEvent> = {
        type: RundownEventType.RESET,
      }

      const result = (): RundownResetEvent => testee.parseResetEvent(event)

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

  describe(ZodRundownEventParser.prototype.parseInfinitePieceAddedEvent.name, () => {
    it('parses a rundown infinite piece added event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: RundownInfinitePieceAddedEvent = {
        type: RundownEventType.INFINITE_PIECE_ADDED,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
        infinitePiece: {
          id: 'some-piece-id',
          name: 'some-piece',
          partId: 'some-part-id',
          layer: 'some-layer',
          start: 0,
          isPlanned: false,
        },
      }

      const result = testee.parseInfinitePieceAddedEvent(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown infinite piece added event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownInfinitePieceAddedEvent> = {
        type: RundownEventType.INFINITE_PIECE_ADDED,
        rundownId: 'some-rundown-id',
      }

      const result = (): RundownInfinitePieceAddedEvent => testee.parseInfinitePieceAddedEvent(event)

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
          isNext: false,
          isOnAir: false,
          pieces: [],
          playedDuration: 0,
          segmentId: '',
          isPlanned: false,
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
          isNext: false,
          isOnAir: false,
          pieces: [],
          playedDuration: 0,
          segmentId: '',
          isPlanned: false,
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
      const testEntityFactory: TestEntityFactory = new TestEntityFactory()
      const piece: Piece = testEntityFactory.createPiece()
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
})

function createMockOfEntityParser(): EntityParser {
  const mockedEntityParser = mock<EntityParser>()
  when(mockedEntityParser.parsePiece(anything())).thenCall(piece => piece)
  return mockedEntityParser
}
