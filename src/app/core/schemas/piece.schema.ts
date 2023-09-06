import * as zod from 'zod'

export const pieceSchema = zod.object({
    id: zod.string().nonempty(),
    partId: zod.string().nonempty(),
    name: zod.string().nonempty(),
    layer: zod.string().nonempty(),
})
