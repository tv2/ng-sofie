import * as zod from 'zod'
import { RundownEventType } from '../models/rundown-event-type'

export const rundownResetEventSchema = zod.object({
    type: zod.literal(RundownEventType.RESET),
    rundownId: zod.string().nonempty(),
})
