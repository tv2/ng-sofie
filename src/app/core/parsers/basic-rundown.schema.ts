import * as zod from 'zod'

export const BASIC_RUNDOWN_PARSER = zod.object({
    id: zod.string().nonempty(),
    name: zod.string().nonempty(),
    isActive: zod.boolean(),
    modifiedAt: zod.number(),
})

export const BASIC_RUNDOWNS_PARSER = zod.array(BASIC_RUNDOWN_PARSER)
