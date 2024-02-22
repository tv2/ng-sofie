import { ShelfConfigurationUpdatedEvent } from '../models/configuration-event'

export abstract class ConfigurationEventParser {
  public abstract parseShelfConfigurationUpdatedEvent(event: unknown): ShelfConfigurationUpdatedEvent
}
