import * as zod from 'zod'
import { RundownEventType } from '../../models/rundown-event-type'

export const RUNDOWN_DEACTIVATED_EVENT_PARSER = zod.object({
    type: zod.literal(RundownEventType.DEACTIVATED),
    rundownId: zod.string().nonempty(),
})
