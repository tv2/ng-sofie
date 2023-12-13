import { Injectable } from '@angular/core'
import { ActionTriggerParser } from '../abstractions/action-trigger-parser.service'
import { ActionTrigger } from '../models/action-trigger'
import * as zod from 'zod'

@Injectable()
export class ZodActionTriggerParser extends ActionTriggerParser {
  constructor() {
    super()
  }

  private readonly zodActionTriggerParser = zod.object({
    id: zod.string().min(1),
    actionId: zod.string().min(1),
    data: zod.object({}).passthrough(),
  })

  public parseActionTrigger(actionTrigger: ActionTrigger): ActionTrigger {
    return this.zodActionTriggerParser.parse(actionTrigger)
  }

  public parseActionTriggers(actionTriggers: ActionTrigger[]): ActionTrigger[] {
    return this.zodActionTriggerParser.array().parse(actionTriggers)
  }
}
