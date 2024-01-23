interface BlueprintConfiguration {
  serverPostrollDuration: number
}

interface Settings {
  mediaPreviewUrl: string
}

export interface StudioConfiguration {
  data: {
    settings: Settings
    blueprintConfiguration: BlueprintConfiguration
  }
}
