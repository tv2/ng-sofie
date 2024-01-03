import { ActionValidator } from '../abstractions/action-validator.service'
import { Action } from '../models/action'
import * as zod from 'zod'
import { PartActionType, PieceActionType } from '../models/action-type'

export class ZodActionParser implements ActionValidator {
  private readonly actionParser = zod.object({
    id: zod.string().min(1),
    type: zod.nativeEnum(PartActionType).or(zod.nativeEnum(PieceActionType)),
    name: zod.string(),
    description: zod.string().optional(),
    metadata: zod.unknown(),
  })
  private readonly actionsParser = this.actionParser.array()

  public validateAction(action: unknown): Action {
    return this.actionParser.parse(action)
  }

  public validateActions(actions: unknown): Action[] {
    return this.actionsParser.parse(actions)
  }
}
