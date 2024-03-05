import { StudioConfiguration } from '../models/studio-configuration'
import { ShelfConfiguration } from '../models/shelf-configuration'

export abstract class ConfigurationParser {
  public abstract parseStudioConfiguration(studioConfiguration: unknown): StudioConfiguration
  public abstract parseShelfConfiguration(shelfConfiguration: unknown): ShelfConfiguration
}
