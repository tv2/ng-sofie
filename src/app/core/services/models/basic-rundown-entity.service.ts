import { RundownMode } from '../../enums/rundown-mode'
import { BasicRundown } from '../../models/basic-rundown'
import { Injectable } from '@angular/core'

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

  public rehearse(basicRundown: BasicRundown): BasicRundown {
    return {
      ...basicRundown,
      mode: RundownMode.REHEARSAL,
    }
  }
}
