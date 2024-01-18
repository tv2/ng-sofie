import { Configuration } from '../../core/models/configuration'

class mediaPreviewUrl {
  public mediaPreviewUrl: string
  constructor(url: string) {
    this.mediaPreviewUrl = url
  }
}

class Settings {
  public settings: mediaPreviewUrl
  constructor(url: string) {
    this.settings = new mediaPreviewUrl(url)
  }
}

export class StudioConfiguration implements Configuration {
  public data: Settings
  constructor(url: string) {
    this.data = new Settings(url)
  }
}
