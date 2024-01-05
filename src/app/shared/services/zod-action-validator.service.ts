import { ActionValidator } from '../abstractions/action-validator.service'
import { Action } from '../models/action'
import * as zod from 'zod'
import { PartActionType, PieceActionType } from '../models/action-type'

export class ZodActionValidator implements ActionValidator {
  private readonly actionValidator = zod.object({
    id: zod.string().min(1),
    type: zod.nativeEnum(PartActionType).or(zod.nativeEnum(PieceActionType)),
    name: zod.string(),
    description: zod.string().optional(),
    metadata: zod.unknown(),
  })
  private readonly actionsValidator = this.actionValidator.array()

  public validateAction(action: Action): Action {
    return this.actionValidator.parse(action)
  }

  public validateActions(actions: Action[]): Action[] {
    return this.actionsValidator.parse(actions)
  }
}
