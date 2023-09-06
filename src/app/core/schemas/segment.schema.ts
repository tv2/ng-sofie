import * as zod from 'zod'
import { partSchema } from './part.schema'

export const segmentSchema = zod.object({
    id: zod.string().nonempty(),
    rundownId: zod.string().nonempty(),
    name: zod.string().nonempty(),
    isOnAir: zod.boolean(),
    isNext: zod.boolean(),
    parts: zod.array(partSchema),
})
