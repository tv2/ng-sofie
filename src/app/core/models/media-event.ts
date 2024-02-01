import { TypedEvent } from '../../event-system/abstractions/event-observer.service'
import { MediaEventType } from './media-event-type'
import { Media } from '../../shared/services/media'

export interface MediaEvent extends TypedEvent {
  type: MediaEventType
}

export interface MediaCreatedEvent extends MediaEvent {
  type: MediaEventType.MEDIA_CREATED
  media: Media
}

export interface MediaUpdatedEvent extends MediaEvent {
  type: MediaEventType.MEDIA_UPDATED
  media: Media
}

export interface MediaDeletedEvent extends MediaEvent {
  type: MediaEventType.MEDIA_DELETED
  mediaId: string
}
