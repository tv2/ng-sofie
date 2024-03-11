import { TypedEvent } from '../../event-system/abstractions/event-observer.service'
import { StatusMessageEventType } from './status-message-event-type'
import { StatusMessage } from '../../shared/models/status-message'

export interface StatusMessageEvent extends TypedEvent {
  type: StatusMessageEventType.STATUS_MESSAGE
  statusMessage: StatusMessage
}
