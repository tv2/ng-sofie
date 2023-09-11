import * as zod from 'zod'
import { PIECE_PARSER } from './piece.schema'

export const PART_PARSER = zod.object({
    id: zod.string().nonempty(),
    segmentId: zod.string().nonempty(),
    isOnAir: zod.boolean(),
    isNext: zod.boolean(),
    pieces: zod.array(PIECE_PARSER)
})
