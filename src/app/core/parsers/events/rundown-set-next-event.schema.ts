import * as zod from 'zod'
import { RundownEventType } from '../../models/rundown-event-type'

export const RUNDOWN_SET_NEXT_EVENT_PARSER = zod.object({
    type: zod.literal(RundownEventType.SET_NEXT),
    rundownId: zod.string().nonempty(),
    segmentId: zod.string().nonempty(),
    partId: zod.string().nonempty(),
})
