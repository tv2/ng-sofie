import { Tv2ActionParser } from '../abstractions/tv2-action-parser.service'
import { Tv2Action, Tv2ActionContentType } from '../models/tv2-action'
import { Action } from '../models/action'
import * as zod from 'zod'

export class ZodTv2ActionParser implements Tv2ActionParser {
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
