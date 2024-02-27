import { Component, EventEmitter, Input, Output } from '@angular/core'
import { IconButton, IconButtonSize } from 'src/app/shared/enums/icon-button'

export interface SofieTableHeader {
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
  selector: 'sofie-table-header',
  templateUrl: './sofie-table-header.component.html',
  styleUrls: ['./sofie-table-header.component.scss'],
})
export class SofieTableHeaderComponent {
  @Input() public headerData: SofieTableHeader
  @Input() public sortColumn: string
  @Input() public sortDirection: SortDirection
  @Output() public onSortClick: EventEmitter<SofieTableHeader> = new EventEmitter<SofieTableHeader>()

  public SortDirection = SortDirection

  protected readonly IconButton = IconButton
  protected readonly IconButtonSize = IconButtonSize
}
