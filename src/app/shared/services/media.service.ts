import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Media } from './media'

@Injectable()
export abstract class MediaService {
  public abstract getMedia(id: string): Observable<Media>
}
