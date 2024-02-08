import { StudioConfiguration } from '../models/studio-configuration'
import { Shelf } from '../models/shelf'

export abstract class ConfigurationParser {
  public abstract parseStudioConfiguration(studioConfiguration: unknown): StudioConfiguration
  public abstract parseShelf(shelf: unknown): Shelf
}
