import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChange, SimpleChanges, TemplateRef, ViewChild } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { IconButton, IconButtonSize } from '../../enums/icon-button'
import { Subject, takeUntil } from 'rxjs'

@Component({
  selector: 'sofie-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent implements OnChanges, OnDestroy {
  @Input() public iconButtonSize: IconButtonSize
  @Input() public isDialogOpen: boolean
  @Input() public iconButton: IconButton
  @Input() public buttonClasses: string
  @Input() public buttonLabel: string = ''
  @Input() public dialogWidth: string = '500px'
  @Input() public dialogTitle?: string
  @Output() public readonly onClickOpen: EventEmitter<void> = new EventEmitter<void>()
  @Output() private readonly onDialogClose: EventEmitter<void> = new EventEmitter<void>()

  @ViewChild('dialogContentRef') public dialogContentRef: TemplateRef<Element>

  private readonly unsubscribe$: Subject<void> = new Subject<void>()
  private dialogRef: MatDialogRef<Element>

  constructor(private readonly dialog: MatDialog) {}
  public ngOnChanges(changes: SimpleChanges): void {
    const isDialogOpenChange: SimpleChange | undefined = changes['isDialogOpen']
    if (!isDialogOpenChange) {
      return
    }

    if (this.isDialogOpen) {
      this.openDialog()
    } else {
      this.closeDialog()
    }
  }

  public openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContentRef, {
      position: { top: '0', right: '0' },
      width: this.dialogWidth,
      height: '100%',
      exitAnimationDuration: '0ms',
      enterAnimationDuration: '0ms',
    })
    this.subscribeForDialogClose()
  }

  private subscribeForDialogClose(): void {
    this.dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.onDialogClose.emit()
      })
  }

  public closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close()
    }
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe()
  }
}
