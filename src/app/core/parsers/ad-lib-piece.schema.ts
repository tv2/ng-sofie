import * as zod from 'zod'
import { PIECE_PARSER } from './piece.schema'

export const AD_LIB_PIECE_PARSER = PIECE_PARSER.extend({
    start: zod.number(),
    duration: zod.number(),
})
