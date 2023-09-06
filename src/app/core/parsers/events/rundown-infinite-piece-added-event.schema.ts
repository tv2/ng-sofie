import * as zod from 'zod'
import { RundownEventType } from '../../models/rundown-event-type'
import { PIECE_PARSER } from '../piece.schema'

export const RUNDOWN_INFINITE_PIECE_ADDED_EVENT_PARSER = zod.object({
    type: zod.literal(RundownEventType.INFINITE_PIECE_ADDED),
    rundownId: zod.string().nonempty(),
    segmentId: zod.string().nonempty(),
    partId: zod.string().nonempty(),
    infinitePiece: PIECE_PARSER,
})
