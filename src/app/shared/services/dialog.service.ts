import { ComponentType } from '@angular/cdk/overlay'
import { Injectable } from '@angular/core'
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component'
import { StronglyTypedDialog } from '../directives/strongly-typed-dialog.directive'

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

  public openActivationDialog(nameOfRundownToActivate: string, onOk: () => void): void {
    this.open(ConfirmationDialogComponent, {
      data: {
        title: nameOfRundownToActivate,
        message: `Are you sure you want to activate the Rundown?`,
        buttonText: {
          ok: 'Activate',
          cancel: 'Cancel'
        }
      },
    }).afterClosed().subscribe(result => {
      if (!result) return;
      onOk();
    });
  }
}
