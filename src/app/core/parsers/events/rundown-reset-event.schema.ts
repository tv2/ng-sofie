import * as zod from 'zod'
import { RundownEventType } from '../../models/rundown-event-type'

export const RUNDOWN_RESET_EVENT_PARSER = zod.object({
    type: zod.literal(RundownEventType.RESET),
    rundownId: zod.string().nonempty(),
})
