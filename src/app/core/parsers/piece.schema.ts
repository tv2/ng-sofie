import * as zod from 'zod'

export const PIECE_PARSER = zod.object({
    id: zod.string().nonempty(),
    partId: zod.string().nonempty(),
    name: zod.string().nonempty(),
    layer: zod.string().nonempty(),
})
