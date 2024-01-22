import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Media } from './media'

@Injectable()
export abstract class MediaDataService {
  public abstract getMediaDurationById(id: string): Observable<Media>
}
