import { lastValueFrom, Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { MediaService } from './media.service'
import { Media } from './media'
import { Logger } from '../../core/abstractions/logger.service'

@Injectable()
export class MediaStateService {
  private readonly logger: Logger

  constructor(
    private readonly mediaService: MediaService,
    logger: Logger
  ) {
    this.logger = logger.tag('MediaStateService')
  }

  public getMedia(id: string): Promise<Media> {
    try {
      return lastValueFrom(this.fetchMedia(id))
    } catch (error) {
      this.logger.data(error).error('Failed to fetch media.')
      return Promise.reject(error)
    }
  }

  private fetchMedia(id: string): Observable<Media> {
    return this.mediaService.getMedia(id)
  }
}
