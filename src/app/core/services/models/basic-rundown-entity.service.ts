import { BasicRundown } from '../../models/basic-rundown'
import { Injectable } from '@angular/core'
import { RundownMode } from '../../enums/rundown-mode'

@Injectable()
export class BasicRundownEntityService {
  public activate(basicRundown: BasicRundown): BasicRundown {
    return {
      ...basicRundown,
      mode: RundownMode.ACTIVE,
    }
  }

  public deactivate(basicRundown: BasicRundown): BasicRundown {
    return {
      ...basicRundown,
      mode: RundownMode.INACTIVE,
    }
  }
}
