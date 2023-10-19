import { ZodRundownEventParser } from './zod-rundown-event-parser.service'
import { RundownEventType } from '../models/rundown-event-type'
import { anything, instance, mock, when } from '@typestrong/ts-mockito'
import { PartSetAsNextEvent, PartTakenEvent, RundownActivatedEvent, RundownDeactivatedEvent, RundownDeletedEvent, RundownInfinitePieceAddedEvent, RundownResetEvent } from '../models/rundown-event'
import { PieceType } from '../enums/piece-type'
import { EntityParser } from '../abstractions/entity-parser.service'

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
        type: RundownEventType.RUNDOWN_DELETED,
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
        type: RundownEventType.RUNDOWN_DELETED,
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

  describe(ZodRundownEventParser.prototype.parseInfinitePieceAdded.name, () => {
    it('parses a rundown infinite piece added event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: RundownInfinitePieceAddedEvent = {
        type: RundownEventType.INFINITE_PIECE_ADDED,
        timestamp: Date.now(),
        rundownId: 'some-rundown-id',
        infinitePiece: {
          id: 'some-piece-id',
          type: PieceType.UNKNOWN,
          name: 'some-piece',
          partId: 'some-part-id',
          layer: 'some-layer',
          start: 0,
        },
      }

      const result = testee.parseInfinitePieceAdded(event)

      expect(result).toEqual(event)
    })

    it('does not parse a partial rundown infinite piece added event', () => {
      const mockedEntityParser = createMockOfEntityParser()
      const testee = new ZodRundownEventParser(instance(mockedEntityParser))
      const event: Partial<RundownInfinitePieceAddedEvent> = {
        type: RundownEventType.INFINITE_PIECE_ADDED,
        rundownId: 'some-rundown-id',
      }

      const result = (): RundownInfinitePieceAddedEvent => testee.parseInfinitePieceAdded(event)

      expect(result).toThrow()
    })
  })
})

function createMockOfEntityParser(): EntityParser {
  const mockedEntityParser = mock<EntityParser>()
  when(mockedEntityParser.parsePiece(anything())).thenCall(piece => piece)
  return mockedEntityParser
}
