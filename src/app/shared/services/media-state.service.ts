import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs'
import { Injectable, OnDestroy } from '@angular/core'
import { MediaService } from './media.service'
import { Media } from './media'
import { EventSubscription } from '../../event-system/abstractions/event-observer.service'
import { MediaEventObserver } from '../../core/services/media-event-observer.service'
import { MediaCreatedEvent, MediaDeletedEvent } from '../../core/models/media-event'
import { Logger } from '../../core/abstractions/logger.service'

@Injectable()
export class MediaStateService implements OnDestroy {
  private readonly mediaSubjects: Map<string, BehaviorSubject<Media | undefined>> = new Map()
  private readonly subscriptions: EventSubscription[] = []
  private readonly logger: Logger
  private readonly mediaAvailabilitySubjects: Map<string, BehaviorSubject<boolean>> = new Map()

  constructor(
    private readonly mediaService: MediaService,
    private readonly mediaEventObserver: MediaEventObserver,
    logger: Logger
  ) {
    this.logger = logger.tag('MediaStateService')
    lastValueFrom(this.mediaService.getAllMedia())
      .then(mediaAssets => mediaAssets.forEach(media => this.updateMedia(media)))
      .catch(error => this.logger.data(error).error(`Failed while fetching all media from server`))
    this.subscribeToEvents()
  }

  private updateMedia(media: Media): void {
    const mediaSubject: BehaviorSubject<Media | undefined> = this.getMediaSubject(media.sourceName)
    mediaSubject.next(media)
  }

  private getMediaSubject(sourceName: string): BehaviorSubject<Media | undefined> {
    const mediaSubjectKey: string = this.getMediaSubjectKey(sourceName)
    if (!this.mediaSubjects.has(mediaSubjectKey)) {
      this.mediaSubjects.set(mediaSubjectKey, new BehaviorSubject<Media | undefined>(undefined))
    }
    return this.mediaSubjects.get(mediaSubjectKey)!
  }

  private getMediaSubjectKey(sourceName: string): string {
    return sourceName.toUpperCase()
  }

  private subscribeToEvents(): void {
    this.subscriptions.push(this.mediaEventObserver.subscribeToMediaCreated((event: MediaCreatedEvent) => this.updateMedia(event.media)))
    this.subscriptions.push(this.mediaEventObserver.subscribeToMediaDeleted((event: MediaDeletedEvent) => this.deleteMediaFromSubjects(event)))
  }

  private deleteMediaFromSubjects(event: MediaDeletedEvent): void {
    this.mediaSubjects.forEach(subject => {
      if (subject.value?.id === event.mediaId) {
        subject.next(undefined)
      }
    })
  }

  public subscribeToMedia(sourceName: string): Observable<Media | undefined> {
    return this.getMediaSubject(sourceName).asObservable()
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  public subscribeToMediaAvailability(miniShelfVideoClipFile: string | undefined): Observable<boolean> {
    return this.getMediaAvailabilitySubject(miniShelfVideoClipFile).asObservable()
  }

  private getMediaAvailabilitySubject(miniShelfVideoClipFile: string | undefined): BehaviorSubject<boolean> {
    const mediaAvailabilitySubjectKey = this.getMediaAvailabilitySubjectKey(miniShelfVideoClipFile)
    if (!this.mediaAvailabilitySubjects.has(mediaAvailabilitySubjectKey)) {
      this.mediaAvailabilitySubjects.set(mediaAvailabilitySubjectKey, new BehaviorSubject<boolean>(false))
    }
    return this.mediaAvailabilitySubjects.get(mediaAvailabilitySubjectKey)!
  }

  private getMediaAvailabilitySubjectKey(miniShelfVideoClipFile: string | undefined): string {
    return miniShelfVideoClipFile?.toUpperCase() ?? ''
  }
}
