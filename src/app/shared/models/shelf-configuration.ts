import { Tv2ActionContentType } from './tv2-action'

export interface ShelfConfiguration<T> {
  id: string
  actionPanelConfigurations: T[]
}

export interface ShelfActionPanelConfiguration {
  name: string
  rank: number
  actionFilter: Tv2ActionContentType[]
}

export interface ShelfActionPanelConfigurationWithId extends ShelfActionPanelConfiguration {
  id: string
}
