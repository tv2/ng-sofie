import { Component, ViewEncapsulation } from '@angular/core'

export enum SortDirection {
  DESC = 'DESC',
  ASC = 'ASC',
}

export interface SofieTableHeader<T> {
  name: string
  isBeingUsedForSorting?: boolean
  sortCallback: (a: T, b: T) => number
  sortDirection: SortDirection
}

@Component({
  selector: 'sofie-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent {
  constructor() {}
}
