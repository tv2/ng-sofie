import { Tv2ActionContentType } from './tv2-action'

export interface ShelfConfiguration {
  id: string
  actionPanels: ShelfActionPanelConfiguration[]
}

export interface ShelfActionPanelConfiguration {
  name: string
  rank: number
  actionFilter: Tv2ActionContentType[]
}
