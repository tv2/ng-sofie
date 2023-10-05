import { BasicRundown } from '../../models/basic-rundown'
import { Injectable } from '@angular/core'

@Injectable()
export class BasicRundownEntityService {
  public activate(basicRundown: BasicRundown): BasicRundown {
    return {
      ...basicRundown,
      isActive: true,
    }
  }

  public deactivate(basicRundown: BasicRundown): BasicRundown {
    return {
      ...basicRundown,
      isActive: false,
    }
  }
}
