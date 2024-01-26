import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { MediaService } from './media.service'
import { Media } from './media'

@Injectable()
export class MediaStateService {
  private readonly mediaSubject: Map<string, BehaviorSubject<Media>> = new Map()

  constructor(private readonly mediaService: MediaService) {}

  // private resetMediaSubject(id: string): void {
  //   const mediaSubject: BehaviorSubject<Media> | undefined = this.getMediaSubject(id)
  //   if (!mediaSubject) {
  //     return
  //   }
  //   this.fetchMedia(id)
  //     .then(media => mediaSubject.next(media))
  //     .catch(error => this.logger.data(error).error(`Encountered an error while fetching media with id '${id}':`))
  // }

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

  // private getMediaSubject(id: string): BehaviorSubject<Media> | undefined {
  //   const mediaSubject: BehaviorSubject<Media> | undefined = this.mediaSubject.get(id)
  //   if (!mediaSubject) {
  //     return
  //   }
  //   const wasRemoved: boolean = this.removeSubjectIfHasNoObservable(mediaSubject, id).wasRemoved
  //   return wasRemoved ? undefined : mediaSubject
  // }

  // private removeSubjectIfHasNoObservable(mediaSubject: BehaviorSubject<Media>, id: string): { wasRemoved: boolean } {
  //   if (mediaSubject.observed) {
  //     return { wasRemoved: false }
  //   }
  //   mediaSubject.unsubscribe()
  //   this.mediaSubject.delete(id)
  //   return { wasRemoved: true }
  // }
}
