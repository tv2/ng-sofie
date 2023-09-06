import * as zod from 'zod'
import { RundownEventType } from '../../models/rundown-event-type'

export const rundownActivatedEventSchema = zod.object({
    type: zod.literal(RundownEventType.ACTIVATED),
    rundownId: zod.string().nonempty(),
    segmentId: zod.string().nonempty(),
    partId: zod.string().nonempty(),
})
