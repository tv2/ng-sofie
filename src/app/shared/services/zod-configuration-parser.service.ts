import { ConfigurationParser } from '../abstractions/configuration-parser.service'
import { ShelfConfiguration } from '../models/shelf-configuration'
import { StudioConfiguration } from '../models/studio-configuration'
import * as zod from 'zod'
import { Tv2ActionContentType } from '../models/tv2-action'

export class ZodConfigurationParser extends ConfigurationParser {
  private readonly studioConfigurationParser = zod.object({
    settings: zod.object({
      mediaPreviewUrl: zod.string().min(9, 'Media preview url must be longer than 9 characters long i.e. http://tld'),
    }),
    blueprintConfiguration: zod.object({
      ServerPostrollDuration: zod.number().min(0, 'Server post-roll duration must be 0 or more.'),
      JingleFolder: zod.string(),
    }),
  })

  public parseStudioConfiguration(studioConfiguration: unknown): StudioConfiguration {
    return this.studioConfigurationParser.parse(studioConfiguration)
  }

  private readonly shelfActionPanelConfigurationParser = zod.object({
    id: zod.string(),
    name: zod.string(),
    rank: zod.number(),
    actionFilter: zod.nativeEnum(Tv2ActionContentType).array(),
  })

  private readonly shelfConfigurationParser = zod.object({
    id: zod.string(),
    actionPanelConfigurations: zod.array(this.shelfActionPanelConfigurationParser),
    staticActionIds: zod.string().array(),
  })

  public parseShelfConfiguration(shelfConfiguration: unknown): ShelfConfiguration {
    return this.shelfConfigurationParser.parse(shelfConfiguration)
  }
}
