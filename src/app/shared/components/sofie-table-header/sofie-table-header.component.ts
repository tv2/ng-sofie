import { Component, EventEmitter, Input, Output } from '@angular/core'
import { IconButton, IconButtonSize } from 'src/app/shared/enums/icon-button'

export interface SofieTableHeaderToBeDeleted {
  key: string
  size?: SofieTableHeaderSize
  label?: string
  isSortable?: boolean
}

export enum SortDirection {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum SofieTableHeaderSize {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  auto = 'auto',
}

@Component({
  selector: 'sofie-table-header-to-be-deleted',
  templateUrl: './sofie-table-header.component.html',
  styleUrls: ['./sofie-table-header.component.scss'],
})
export class SofieTableHeaderComponent {
  @Input() public headerData: SofieTableHeaderToBeDeleted
  @Input() public sortColumn: string
  @Input() public sortDirection: SortDirection
  @Output() public onSortClick: EventEmitter<SofieTableHeaderToBeDeleted> = new EventEmitter<SofieTableHeaderToBeDeleted>()

  public SortDirection = SortDirection

  protected readonly IconButton = IconButton
  protected readonly IconButtonSize = IconButtonSize
}
