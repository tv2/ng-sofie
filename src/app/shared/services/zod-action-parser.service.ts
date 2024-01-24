import { ActionParser } from '../abstractions/action-parser.service'
import { Action, ActionArgumentSchemaType } from '../models/action'
import * as zod from 'zod'
import { PartActionType, PieceActionType } from '../models/action-type'

export class ZodActionParser implements ActionParser {
  private readonly actionParser = zod.object({
    id: zod.string().min(1),
    type: zod.nativeEnum(PartActionType).or(zod.nativeEnum(PieceActionType)),
    name: zod.string(),
    description: zod.string().optional(),
    metadata: zod.unknown(),
    argument: zod
      .object({
        description: zod.string(),
        name: zod.string(),
        type: zod.nativeEnum(ActionArgumentSchemaType),
      })
      .optional(),
  })
  private readonly actionsParser = this.actionParser.array()

  public parseAction(action: unknown): Action {
    return this.actionParser.parse(action)
  }

  public parseActions(actions: unknown): Action[] {
    return this.actionsParser.parse(actions)
  }
}
