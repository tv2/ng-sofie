import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { MediaData } from './media-data'

@Injectable()
export abstract class MediaDataService {
  public abstract getMediaDurationById(id: string): Observable<MediaData>
}
