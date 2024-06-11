import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef, ViewEncapsulation } from '@angular/core'
import { Icon, IconSize } from '../../enums/icon'

export enum SortDirection {
  DESC = 'DESC',
  ASC = 'ASC',
}

export interface SofieTableHeader<T> {
  name: string
  sortCallback: (a: T, b: T) => number
  sortDirection?: SortDirection
}

const UPWARD_TRIANGLE_ICON_TOP_POSITION_PX: number = 3
const DOWNWARD_TRIANGLE_ICON_TOP_POSITION_PX: number = -2

@Component({
  selector: 'sofie-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent<T> implements OnChanges {
  protected readonly IconSize = IconSize

  @Input() public headers: SofieTableHeader<T>[] = []

  @Input() public entities: T[] = []
  @Input() public rowTemplate: TemplateRef<{ tableRowData: T }>
  @Input() public shouldShowRowCallback: (entity: T) => boolean = (): boolean => true

  @Input() public showCheckboxes: boolean = false
  @Input() public selectedEntities: Set<T> = new Set()
  @Output() public selectedEntitiesChange: EventEmitter<Set<T>> = new EventEmitter()

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['entities']) {
      this.sortEntities()
    }
  }

  private sortEntities(): void {
    const header: SofieTableHeader<T> | undefined = this.headers.find(header => header.sortDirection)
    if (!header) {
      return
    }
    this.entities.sort(header.sortCallback)
    if (header.sortDirection === SortDirection.ASC) {
      this.entities.reverse()
    }
  }

  public getRowTemplateContext(entity: T): { tableRowData: T } {
    return {
      tableRowData: entity,
    }
  }

  public toggleTableHeaderForSorting(header: SofieTableHeader<T>): void {
    header.sortDirection = header.sortDirection === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC

    this.headers.forEach(h => {
      if (h === header) {
        return
      }
      h.sortDirection = undefined
    })

    this.sortEntities()
  }

  public getSortIcon(header: SofieTableHeader<T>): Icon {
    return header.sortDirection === SortDirection.ASC ? Icon.UPWARD_TRIANGLE : Icon.DOWNWARD_TRIANGLE
  }

  public getSortIconTopPostion(header: SofieTableHeader<T>): number {
    return header.sortDirection === SortDirection.ASC ? UPWARD_TRIANGLE_ICON_TOP_POSITION_PX : DOWNWARD_TRIANGLE_ICON_TOP_POSITION_PX
  }

  public toggleAllEntities(isSelected: boolean): void {
    this.entities.forEach(actionPanel => this.toggleEntity(isSelected, actionPanel))
  }

  public isAllEntitiesSelected(): boolean {
    if (this.entities.length === 0) {
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
