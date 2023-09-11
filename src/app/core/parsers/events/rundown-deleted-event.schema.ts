import * as zod from 'zod'
import { RundownEventType } from '../../models/rundown-event-type'

export const RUNDOWN_DELETED_EVENT_PARSER = zod.object({
    type: zod.literal(RundownEventType.DELETED),
    rundownId: zod.string().nonempty(),
})
