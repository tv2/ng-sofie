interface BlueprintConfiguration {
  ServerPostrollDuration: number
}

interface StudioSettings {
  mediaPreviewUrl: string
}

export interface StudioConfiguration {
  settings: StudioSettings
  blueprintConfiguration: BlueprintConfiguration
}
