import * as zod from 'zod'
import { RundownEventType } from '../../models/rundown-event-type'

export const RUNDOWN_TAKEN_EVENT_PARSER = zod.object({
    type: zod.literal(RundownEventType.TAKEN),
    rundownId: zod.string().nonempty(),
    segmentId: zod.string().nonempty(),
    partId: zod.string().nonempty(),
})
