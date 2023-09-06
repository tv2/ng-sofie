import * as zod from 'zod'
import { RundownEventType } from '../../models/rundown-event-type'
import { adLibPieceSchema } from '../ad-lib-piece.schema'


export const rundownAdLibPieceInsertedEventSchema = zod.object({
    type: zod.literal(RundownEventType.AD_LIB_PIECE_INSERTED),
    rundownId: zod.string().nonempty(),
    segmentId: zod.string().nonempty(),
    partId: zod.string().nonempty(),
    adLibPiece: adLibPieceSchema,
})
