import { lastValueFrom } from 'rxjs'
import { Injectable } from '@angular/core'
import { MediaService } from './media.service'
import { Media } from './media'

@Injectable()
export class MediaStateService {
  constructor(private readonly mediaService: MediaService) {}

  public async getMedia(id: string): Promise<Media> {
    return await this.fetchMedia(id)
  }

  public fetchMedia(id: string): Promise<Media> {
    return lastValueFrom(this.mediaService.getMedia(id))
  }
}
