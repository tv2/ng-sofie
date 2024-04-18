import { Tv2ActionContentType } from './tv2-action'

export interface ShelfConfiguration {
  id: string
  actionPanelConfigurations: ShelfActionPanelConfiguration[]
  staticActionIds: string[]
}

export interface ShelfActionPanelConfiguration {
  id: string
  name: string
  rank: number
  actionFilter: Tv2ActionContentType[]
}
