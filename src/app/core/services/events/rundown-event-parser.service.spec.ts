import { RundownEventParser } from './rundown-event-parser.service'
import { RundownEventType } from '../../models/rundown-event-type'
import {
    RundownActivatedEvent, RundownAdLibPieceInserted,
    RundownDeactivatedEvent, RundownInfinitePieceAddedEvent,
    RundownResetEvent, RundownSetNextEvent,
    RundownTakenEvent
} from '../../models/rundown-event'

describe(RundownEventParser.name, () => {
    describe(RundownEventParser.prototype.parseActivatedEvent.name, () => {
        it('parses a rundown activated event', () => {
            const testee = new RundownEventParser()
            const event: RundownActivatedEvent = {
                type: RundownEventType.ACTIVATED,
                rundownId: 'some-rundown-id',
                segmentId: 'some-segment-id',
                partId: 'some-segment-id',
            }

            const result = testee.parseActivatedEvent(event)

            expect(result).toEqual(event)
        })

        it('does not parse a partial rundown activated event', () => {
            const testee = new RundownEventParser()
            const event: Partial<RundownActivatedEvent> = {
                type: RundownEventType.ACTIVATED,
                rundownId: 'some-rundown-id',
            }

            const result = () => testee.parseActivatedEvent(event)

            expect(result).toThrow()
        })
    })

    describe(RundownEventParser.prototype.parseDeactivatedEvent.name, () => {
        it('parses a rundown deactivated event', () => {
            const testee = new RundownEventParser()
            const event: RundownDeactivatedEvent = {
                type: RundownEventType.DEACTIVATED,
                rundownId: 'some-rundown-id',
            }

            const result = testee.parseDeactivatedEvent(event)

            expect(result).toEqual(event)
        })

        it('does not parse a partial rundown deactivated event', () => {
            const testee = new RundownEventParser()
            const event: Partial<RundownDeactivatedEvent> = {
                type: RundownEventType.DEACTIVATED,
            }

            const result = () => testee.parseDeactivatedEvent(event)

            expect(result).toThrow()
        })
    })

    describe(RundownEventParser.prototype.parseResetEvent.name, () => {
        it('parses a rundown reset event', () => {
            const testee = new RundownEventParser()
            const event: RundownResetEvent = {
                type: RundownEventType.RESET,
                rundownId: 'some-rundown-id',
            }

            const result = testee.parseResetEvent(event)

            expect(result).toEqual(event)
        })

        it('does not parse a partial rundown reset event', () => {
            const testee = new RundownEventParser()
            const event: Partial<RundownResetEvent> = {
                type: RundownEventType.RESET,
            }

            const result = () => testee.parseResetEvent(event)

            expect(result).toThrow()
        })
    })

    describe(RundownEventParser.prototype.parseTakenEvent.name, () => {
        it('parses a rundown taken event', () => {
            const testee = new RundownEventParser()
            const event: RundownTakenEvent = {
                type: RundownEventType.TAKEN,
                rundownId: 'some-rundown-id',
                segmentId: 'some-segment-id',
                partId: 'some-part-id',
            }

            const result = testee.parseTakenEvent(event)

            expect(result).toEqual(event)
        })

        it('does not parse a partial rundown taken event', () => {
            const testee = new RundownEventParser()
            const event: Partial<RundownTakenEvent> = {
                type: RundownEventType.TAKEN,
            }

            const result = () => testee.parseTakenEvent(event)

            expect(result).toThrow()
        })
    })

    describe(RundownEventParser.prototype.parseSetNextEvent.name, () => {
        it('parses a rundown set next event', () => {
            const testee = new RundownEventParser()
            const event: RundownSetNextEvent = {
                type: RundownEventType.SET_NEXT,
                rundownId: 'some-rundown-id',
                segmentId: 'some-segment-id',
                partId: 'some-part-id',
            }

            const result = testee.parseSetNextEvent(event)

            expect(result).toEqual(event)
        })

        it('does not parse a partial rundown set next event', () => {
            const testee = new RundownEventParser()
            const event: Partial<RundownSetNextEvent> = {
                type: RundownEventType.SET_NEXT,
            }

            const result = () => testee.parseSetNextEvent(event)

            expect(result).toThrow()
        })
    })

    describe(RundownEventParser.prototype.parseAdLibPieceInserted.name, () => {
        it('parses a rundown ad-lib piece inserted event', () => {
            const testee = new RundownEventParser()
            const event: RundownAdLibPieceInserted = {
                type: RundownEventType.AD_LIB_PIECE_INSERTED,
                rundownId: 'some-rundown-id',
                segmentId: 'some-segment-id',
                partId: 'some-part-id',
                adLibPiece: {
                    id: 'some-piece-id',
                    name: 'some-piece',
                    partId: 'some-part-id',
                    layer: 'some-layer',
                    start: 0,
                    duration: 1,
                }
            }

            const result = testee.parseAdLibPieceInserted(event)

            expect(result).toEqual(event)
        })

        it('does not parse a partial rundown ad-lib piece inserted event', () => {
            const testee = new RundownEventParser()
            const event: Partial<RundownAdLibPieceInserted> = {
                type: RundownEventType.AD_LIB_PIECE_INSERTED,
                rundownId: 'some-rundown-id',
            }

            const result = () => testee.parseAdLibPieceInserted(event)

            expect(result).toThrow()
        })
    })

    describe(RundownEventParser.prototype.parseInfinitePieceAdded.name, () => {
        it('parses a rundown infinite piece added event', () => {
            const testee = new RundownEventParser()
            const event: RundownInfinitePieceAddedEvent = {
                type: RundownEventType.INFINITE_PIECE_ADDED,
                rundownId: 'some-rundown-id',
                segmentId: 'some-segment-id',
                partId: 'some-part-id',
                infinitePiece: {
                    id: 'some-piece-id',
                    name: 'some-piece',
                    partId: 'some-part-id',
                    layer: 'some-layer',
                }
            }

            const result = testee.parseInfinitePieceAdded(event)

            expect(result).toEqual(event)
        })

        it('does not parse a partial rundown infinite piece added event', () => {
            const testee = new RundownEventParser()
            const event: Partial<RundownInfinitePieceAddedEvent> = {
                type: RundownEventType.INFINITE_PIECE_ADDED,
                rundownId: 'some-rundown-id',
            }

            const result = () => testee.parseInfinitePieceAdded(event)

            expect(result).toThrow()
        })
    })
})
