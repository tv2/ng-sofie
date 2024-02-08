import { Tv2ActionContentType } from './tv2-action'

export interface Shelf {
  id: string
  actionPanels: ShelfActionPanel[]
}

export interface ShelfActionPanel {
  name: string
  rank: number
  actionFilter: Tv2ActionContentType[]
}
