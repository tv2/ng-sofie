import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef, ViewEncapsulation } from '@angular/core'
import { IconButton, IconButtonSize } from '../../enums/icon-button'

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
export class TableComponent<T> implements OnChanges {
  protected readonly IconButtonSize = IconButtonSize

  @Input() public headers: SofieTableHeader<T>[] = []

  @Input() public entities: T[]
  @Input() public rowTemplate: TemplateRef<T>

  @Input() public showCheckboxes: boolean = false
  @Input() public selectedEntities: Set<T> = new Set()
  @Output() public selectedEntitiesChange: EventEmitter<Set<T>> = new EventEmitter()

  constructor() {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['entities']) {
      this.sortEntities()
    }
  }

  public getRowTemplateContext(entity: T): { tableRowData: T } {
    return {
      tableRowData: entity,
    }
  }

  public toggleTableHeaderForSorting(header: SofieTableHeader<T>): void {
    header.isBeingUsedForSorting = true
    header.sortDirection = header.sortDirection === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC

    this.headers.forEach(h => {
      if (h === header) {
        return
      }
      h.isBeingUsedForSorting = false
      h.sortDirection = SortDirection.DESC
    })

    this.sortEntities()
  }

  private sortEntities(): void {
    const header: SofieTableHeader<T> | undefined = this.headers.find(header => header.isBeingUsedForSorting)
    if (!header) {
      return
    }
    this.entities.sort(header.sortCallback)
    if (header.sortDirection === SortDirection.ASC) {
      this.entities.reverse()
    }
  }

  public getSortIcon(header: SofieTableHeader<T>): IconButton {
    return header.sortDirection === SortDirection.ASC ? IconButton.SORT_UP : IconButton.SORT_DOWN
  }

  public toggleAllEntities(isSelected: boolean): void {
    this.entities.forEach(actionPanel => this.toggleEntity(isSelected, actionPanel))
  }

  public isAllEntitiesSelected(): boolean {
    if (!this.entities || this.entities.length === 0) {
      return false
    }
    return this.selectedEntities.size === this.entities.length
  }

  public toggleEntity(isSelected: boolean, entity: T): void {
    if (isSelected) {
      this.selectedEntities.add(entity)
      return
    }
    this.selectedEntities.delete(entity)
  }

  public isEntitySelected(entity: T): boolean {
    return this.selectedEntities.has(entity)
  }
}
