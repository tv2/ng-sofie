import * as zod from 'zod'
import { pieceSchema } from './piece.schema'

export const partSchema = zod.object({
    id: zod.string().nonempty(),
    segmentId: zod.string().nonempty(),
    isOnAir: zod.boolean(),
    isNext: zod.boolean(),
    pieces: zod.array(pieceSchema)
})
