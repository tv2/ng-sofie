import * as zod from 'zod'
import { RundownEventType } from '../../models/rundown-event-type'
import { pieceSchema } from '../piece.schema'

export const rundownInfinitePieceAddedEventSchema = zod.object({
    type: zod.literal(RundownEventType.INFINITE_PIECE_ADDED),
    rundownId: zod.string().nonempty(),
    segmentId: zod.string().nonempty(),
    partId: zod.string().nonempty(),
    infinitePiece: pieceSchema,
})
