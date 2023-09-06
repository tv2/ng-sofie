import * as zod from 'zod'

export const basicRundownSchema = zod.object({
    id: zod.string().nonempty(),
    name: zod.string().nonempty(),
    isActive: zod.boolean(),
    lastModifiedEpochTime: zod.number(),
})

export const basicRundownsSchema = zod.array(basicRundownSchema)
