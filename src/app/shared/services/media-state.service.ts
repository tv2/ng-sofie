import { BehaviorSubject, lastValueFrom, Observable, Subject } from 'rxjs'
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
    this.mediaService.getMediaAssets().then(mediaCollection => mediaCollection.forEach(media => this.updateMedia(media)))
    this.subscribeToEvents()
  }

  private updateMedia(media: Media): void {
    const mediaSubject: BehaviorSubject<Media | undefined> | undefined = this.mediaSubjects.get(media.sourceName)
    if (mediaSubject) {
      mediaSubject.next(media)
      return
    }
    this.mediaSubjects.set(media.sourceName, new BehaviorSubject<Media | undefined>(media))
  }

  private subscribeToEvents(): void {
    this.subscriptions.push(this.mediaEventObserver.subscribeToMediaCreated((event: MediaCreatedEvent) => this.createMediaFromEvent(event)))
    this.subscriptions.push(this.mediaEventObserver.subscribeToMediaDeleted((event: MediaDeletedEvent) => this.deleteMediaFromEvent(event)))
  }

  private createMediaFromEvent(event: MediaCreatedEvent): void {
    const mediaSubject: BehaviorSubject<Media | undefined> | undefined = this.mediaSubjects.get(event.media.sourceName)
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

  public subscribeToMedia(id: string): Observable<Media | undefined> {
    return this.createMediaSubject(id).asObservable()
  }

  private createMediaSubject(id: string): BehaviorSubject<Media | undefined> {
    const mediaSubject: BehaviorSubject<Media | undefined> | undefined = this.mediaSubjects.get(id)
    if (mediaSubject) {
      return mediaSubject
    }
    const subject: BehaviorSubject<Media | undefined> = new BehaviorSubject<Media | undefined>(undefined)
    this.mediaSubjects.set(id, subject)
    this.fetchMedia(id)
      .then(media => {
        subject.next(media)
        console.log('øæasldkaøældksa: ', media)
      })
      .catch(error => {
        console.log('øæasldkaøældksa: error:', error)
        this.logger.data(error).warn(`Failed while fetching media with id ${id} from server`)
      })
    return subject
  }

  private async fetchMedia(id: string): Promise<Media> {
    return lastValueFrom(this.mediaService.getMedia(id))
  }
}
