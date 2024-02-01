import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { MediaService } from './media.service'
import { Media } from './media'

@Injectable()
export class MediaStateService {
  private readonly mediaSubject: Map<string, BehaviorSubject<Media>> = new Map()

  constructor(private readonly mediaService: MediaService) {}

  public async subscribeToMedia(id: string): Promise<Observable<Media>> {
    const mediaSubject: BehaviorSubject<Media> = await this.createMediaSubject(id)
    return mediaSubject.asObservable()
  }

  private async createMediaSubject(id: string): Promise<BehaviorSubject<Media>> {
    const mediaSubject: BehaviorSubject<Media> | undefined = this.mediaSubject.get(id)
    if (mediaSubject) {
      return mediaSubject
    }
    return await this.getCleanMediaSubject(id)
  }

  private async getCleanMediaSubject(id: string): Promise<BehaviorSubject<Media>> {
    const media: Media = await this.fetchMedia(id)
    return new BehaviorSubject<Media>(media)
  }

  private async fetchMedia(id: string): Promise<Media> {
    return lastValueFrom(this.mediaService.getMedia(id))
  }
}
