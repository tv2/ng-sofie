import * as zod from 'zod'
import { RundownEventType } from '../../models/rundown-event-type'

export const rundownDeletedEventSchema = zod.object({
    type: zod.literal(RundownEventType.DELETED),
    rundownId: zod.string().nonempty(),
})
