import * as zod from 'zod'
import { BASIC_RUNDOWN_PARSER } from './basic-rundown.schema'
import { SEGMENT_PARSER } from './segment.schema'
import { PIECE_PARSER } from './piece.schema'

export const RUNDOWN_PARSER = BASIC_RUNDOWN_PARSER.extend({
    segments: zod.array(SEGMENT_PARSER),
    infinitePieces: zod.array(PIECE_PARSER),
})
