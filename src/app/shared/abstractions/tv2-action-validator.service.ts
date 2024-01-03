import { Action } from '../models/action'
import { Tv2Action } from '../models/tv2-action'

export abstract class Tv2ActionValidator {
  public abstract parseTv2Action(action: Action): Tv2Action
}
