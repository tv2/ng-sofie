import { ComponentType } from '@angular/cdk/overlay';
import { Directive, Inject, Injectable } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';

@Directive()
export abstract class StronglyTypedDialog<DialogData, DialogResult> {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<
      StronglyTypedDialog<DialogData, DialogResult>,
      DialogResult
    >
  ) {}
}

@Injectable()
export class DialogService {
  constructor(public dialog: MatDialog) {}

  private open<DialogData, DialogResult>(
    component: ComponentType<StronglyTypedDialog<DialogData, DialogResult>>,
    config?: MatDialogConfig<DialogData>
  ): MatDialogRef<
    StronglyTypedDialog<DialogData, DialogResult>,
    DialogResult
  > {
    return this.dialog.open(component, config);
  }

  public openDeletionDialog(typeOfThingToDelete: string, nameOrIdOfThingToDelete: string, onOk: () => void): void {
    this.open(ConfirmationDialogComponent, {
      data: {
        title: `Delete ${typeOfThingToDelete}?`,
        message: `Are you sure you want to delete the ${typeOfThingToDelete} "${nameOrIdOfThingToDelete}"?\n\nPlease note: This action is irreversible!`,
        buttonText: {
          ok: 'Delete',
          cancel: 'Cancel'
        }
      },
    }).afterClosed().subscribe(result => {
      if (!result) return;
      onOk();
    });
  }
}
