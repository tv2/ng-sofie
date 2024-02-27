import { TypedEvent } from '../../event-system/abstractions/event-observer.service'
import { ConfigurationEventType } from './configuration-event-type'
import { ShelfActionPanelConfiguration, ShelfConfiguration } from '../../shared/models/shelf-configuration'

export interface ConfigurationEvent extends TypedEvent {
  type: ConfigurationEventType
}

export interface ShelfConfigurationUpdatedEvent extends ConfigurationEvent {
  readonly type: ConfigurationEventType.SHELF_CONFIGURATION_UPDATED
  readonly shelfConfiguration: ShelfConfiguration<ShelfActionPanelConfiguration>
}
