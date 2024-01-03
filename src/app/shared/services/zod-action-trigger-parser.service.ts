import { Injectable } from '@angular/core'
import { ActionTriggerParser } from '../abstractions/action-trigger-parser.service'
import { ActionTrigger, KeyboardTriggerData } from '../models/action-trigger'
import * as zod from 'zod'

@Injectable()
export class ZodActionTriggerParser extends ActionTriggerParser {
  constructor() {
    super()
  }

  private readonly zodActionTriggerParser = zod.object({
    id: zod.string().min(1),
    actionId: zod.string().min(1),
    data: zod.object({
      keys: zod.string().array(),
      actionArguments: zod.number().or(zod.string().optional()).optional(),
    }),
  })

  private readonly actionTriggersParser = this.zodActionTriggerParser.array()

  public parseActionTriggers(actionTriggers: ActionTrigger<KeyboardTriggerData>[]): ActionTrigger<KeyboardTriggerData>[] {
    return this.actionTriggersParser.parse(actionTriggers)
  }
}
