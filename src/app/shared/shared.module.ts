import {NgModule} from '@angular/core'
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar'
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {HeaderComponent} from './components/header/header.component';
import {CommonModule} from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatListModule} from "@angular/material/list";
import {ConfirmationDialogComponent} from './components/confirmation-dialog/confirmation-dialog.component'
import {MatDialogModule} from '@angular/material/dialog'
import {DialogService} from './services/dialog.service'


@NgModule({
  declarations: [
    HeaderComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatButtonToggleModule,
    MatListModule,
    MatDialogModule,
  ],
  exports: [
    CommonModule,
    HeaderComponent
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 5000, verticalPosition: 'top'}},
    DialogService
  ]
})
export class SharedModule {}
