import { Injectable } from '@angular/core'
import { ActionTriggerParser } from '../abstractions/action-trigger-parser.service'
import { ActionTrigger, KeyboardTriggerData } from '../models/action-trigger'
import * as zod from 'zod'
import { Keys } from 'src/app/keyboard/value-objects/key-binding'

@Injectable()
export class ZodActionTriggerParser extends ActionTriggerParser {
  constructor() {
    super()
  }
  private readonly zodActionTriggerDataParser = zod.object({
    keys: zod.string().array().min(1) as unknown as zod.ZodType<Keys>,
    label: zod.string(),
    actionArguments: zod.number().or(zod.string().optional()).optional(),
  })

  private readonly zodActionTriggerParser = zod.object({
    id: zod.string().min(1),
    actionId: zod.string().min(1),
    data: zod
      .object({})
      .passthrough()
      .transform((data: unknown) => this.parseActionTriggerData(data)),
  })

  private readonly actionTriggersParser = this.zodActionTriggerParser.array()

  public parseActionTriggerData(data: unknown): KeyboardTriggerData {
    return this.zodActionTriggerDataParser.parse(data)
  }

  public parseActionTriggers(actionTriggers: ActionTrigger<KeyboardTriggerData>[]): ActionTrigger<KeyboardTriggerData>[] {
    return this.actionTriggersParser.parse(actionTriggers)
  }
}
