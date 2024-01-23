import { lastValueFrom } from 'rxjs'
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

  public async getMedia(id: string): Promise<Media | undefined> {
    let media: Media | undefined = undefined
    try {
      media = await this.fetchMedia(id)
    } catch (error) {
      this.logger.error(`Failed to fetch media with id: ${id}, reason: ${error}`)
    }
    return media
  }

  public fetchMedia(id: string): Promise<Media> {
    return lastValueFrom(this.mediaService.getMedia(id))
  }
}
