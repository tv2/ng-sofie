export interface ShowStyleVariantBlueprintConfiguration {
  SelectedGfxSetupName: {
    value: string
    label: string
  }
  GfxDefaults: {
    id?: string
    DefaultSetupName: {
      value: string
      label: string
    }
    DefaultSchema: {
      value: string
      label: string
    }
    DefaultDesign: {
      value: string
      label: string
    }
  }[]
}

export interface ShowStyleVariant {
  id: string
  showStyleBaseId: string
  name: string
  blueprintConfiguration: ShowStyleVariantBlueprintConfiguration
}
