interface BlueprintConfiguration {
  ServerPostrollDuration: number
  JingleFolder: string
}

interface StudioSettings {
  mediaPreviewUrl: string
}

export interface StudioConfiguration {
  settings: StudioSettings
  blueprintConfiguration: BlueprintConfiguration
}
