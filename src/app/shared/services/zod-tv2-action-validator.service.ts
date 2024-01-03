import { Tv2ActionValidator } from '../abstractions/tv2-action-validator.service'
import { Tv2Action, Tv2ActionContentType } from '../models/tv2-action'
import { Action } from '../models/action'
import * as zod from 'zod'

export class ZodTv2ActionValidator implements Tv2ActionValidator {
  private readonly tv2ActionMetadataParser = zod
    .object({
      contentType: zod.nativeEnum(Tv2ActionContentType),
    })
    .passthrough()
  public parseTv2Action(action: Action): Tv2Action {
    return {
      ...action,
      metadata: this.tv2ActionMetadataParser.parse(action.metadata),
    }
  }
}
