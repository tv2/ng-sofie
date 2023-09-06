import * as zod from 'zod'
import { RundownEventType } from '../../models/rundown-event-type'
import { AD_LIB_PIECE_PARSER } from '../ad-lib-piece.schema'


export const RUNDOWN_AD_LIB_PIECE_INSERTED_EVENT_PARSER = zod.object({
    type: zod.literal(RundownEventType.AD_LIB_PIECE_INSERTED),
    rundownId: zod.string().nonempty(),
    segmentId: zod.string().nonempty(),
    partId: zod.string().nonempty(),
    adLibPiece: AD_LIB_PIECE_PARSER,
})
