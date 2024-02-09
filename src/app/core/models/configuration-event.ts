import { TypedEvent } from '../../event-system/abstractions/event-observer.service'
import { ConfigurationEventType } from './configuration-event-type'
import { ShelfConfiguration } from '../../shared/models/shelf-configuration'

export interface ConfigurationEvent extends TypedEvent {
  type: ConfigurationEventType
}

export interface ShelfConfigurationUpdatedEvent extends ConfigurationEvent {
  type: ConfigurationEventType.SHELF_UPDATED
  shelf: ShelfConfiguration
}
