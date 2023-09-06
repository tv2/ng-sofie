import * as zod from 'zod'
import { basicRundownSchema } from './basic-rundown'
import { segmentSchema } from './segment.schema'
import { pieceSchema } from './piece.schema'

export const rundownSchema = basicRundownSchema.extend({
    segments: zod.array(segmentSchema),
    infinitePieces: zod.array(pieceSchema),
})
