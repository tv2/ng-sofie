import { Injectable } from '@angular/core'
import { ActionTriggerValidator } from '../abstractions/action-trigger-parser.service'
import { ActionTrigger, KeyboardTriggerData } from '../models/action-trigger'
import * as zod from 'zod'

@Injectable()
export class ZodActionTriggerValidator extends ActionTriggerValidator {
  constructor() {
    super()
  }

  private readonly zodActionTriggerValidator = zod.object({
    id: zod.string().min(1),
    actionId: zod.string().min(1),
    data: zod.object({
      keys: zod.string().array(),
      actionArguments: zod.number().or(zod.string().optional()).optional(),
    }),
  })

  private readonly actionTriggersValidator = this.zodActionTriggerValidator.array()

  public parseActionTriggers(actionTriggers: ActionTrigger<KeyboardTriggerData>[]): ActionTrigger<KeyboardTriggerData>[] {
    return this.actionTriggersValidator.parse(actionTriggers)
  }
}
