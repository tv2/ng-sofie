import * as zod from 'zod'
import { RundownEventType } from '../../models/rundown-event-type'

export const rundownSetNextEventSchema = zod.object({
    type: zod.literal(RundownEventType.SET_NEXT),
    rundownId: zod.string().nonempty(),
    segmentId: zod.string().nonempty(),
    partId: zod.string().nonempty(),
})
