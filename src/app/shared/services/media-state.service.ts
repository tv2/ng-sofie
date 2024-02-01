import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { MediaService } from './media.service'
import { Media } from './media'
import { EventSubscription } from '../../event-system/abstractions/event-observer.service'
import { MediaEventObserver } from '../../core/services/media-event-observer.service'
import { MediaCreatedEvent, MediaDeletedEvent } from '../../core/models/media-event'
import { Logger } from '../../core/abstractions/logger.service'

@Injectable()
export class MediaStateService {
  private readonly mediaSubjects: Map<string, BehaviorSubject<Media | undefined>> = new Map()
  private readonly subscriptions: EventSubscription[] = []
  private readonly logger: Logger

  constructor(
    private readonly mediaService: MediaService,
    private readonly mediaEventObserver: MediaEventObserver,
    logger: Logger
  ) {
    this.logger = logger.tag('MediaStateService')
    this.subscribeToEvents()
  }

  private subscribeToEvents(): void {
    this.subscriptions.push(this.mediaEventObserver.subscribeToMediaCreated((event: MediaCreatedEvent) => this.createMediaFromEvent(event)))
    this.subscriptions.push(this.mediaEventObserver.subscribeToMediaDeleted((event: MediaDeletedEvent) => this.deleteMediaFromEvent(event)))
  }

  private createMediaFromEvent(event: MediaCreatedEvent): void {
    const mediaSubject = this.mediaSubjects.get(event.media.sourceName)
    if (mediaSubject) {
      mediaSubject.next(event.media)
      return
    }
    this.mediaSubjects.set(event.media.sourceName, new BehaviorSubject<Media | undefined>(event.media))
  }

  private deleteMediaFromEvent(event: MediaDeletedEvent): void {
    this.mediaSubjects.forEach(subject => {
      if (subject.value?.id === event.mediaId) {
        subject.next(undefined)
      }
    })
  }

  public async subscribeToMedia(id: string): Promise<Observable<Media | undefined>> {
    const mediaSubject: BehaviorSubject<Media | undefined> = await this.createMediaSubject(id)
    return mediaSubject.asObservable()
  }

  private async createMediaSubject(id: string): Promise<BehaviorSubject<Media | undefined>> {
    const mediaSubject: BehaviorSubject<Media | undefined> | undefined = this.mediaSubjects.get(id)
    if (mediaSubject) {
      return mediaSubject
    }
    const cleanMediaSubject = await this.getCleanMediaSubject(id)
    this.mediaSubjects.set(id, cleanMediaSubject)
    return cleanMediaSubject
  }

  private async getCleanMediaSubject(id: string): Promise<BehaviorSubject<Media | undefined>> {
    try {
      const media: Media = await this.fetchMedia(id)
      return new BehaviorSubject<Media | undefined>(media)
    } catch (error) {
      this.logger.data(error).warn(`Failed while fetching media with id ${id} from server`)
      return new BehaviorSubject<Media | undefined>(undefined)
    }
  }

  private async fetchMedia(id: string): Promise<Media> {
    return lastValueFrom(this.mediaService.getMedia(id))
  }
}
