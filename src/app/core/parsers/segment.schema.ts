import * as zod from 'zod'
import { PART_PARSER } from './part.schema'

export const SEGMENT_PARSER = zod.object({
    id: zod.string().nonempty(),
    rundownId: zod.string().nonempty(),
    name: zod.string().nonempty(),
    isOnAir: zod.boolean(),
    isNext: zod.boolean(),
    parts: zod.array(PART_PARSER),
})
