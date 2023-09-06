import * as zod from 'zod'
import { pieceSchema } from './piece.schema'

export const adLibPieceSchema = pieceSchema.extend({
    start: zod.number(),
    duration: zod.number(),
})
