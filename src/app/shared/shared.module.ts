import { NgModule } from '@angular/core'
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { HeaderComponent } from './components/header/header.component'
import { CommonModule } from '@angular/common'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatCardModule } from '@angular/material/card'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatListModule } from '@angular/material/list'
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component'
import { MatDialogModule } from '@angular/material/dialog'
import { DialogService } from './services/dialog.service'
import { ConnectionErrorService } from './services/connection-error.service'
import { TimestampPipe } from './pipes/timestamp.pipe'
import { PieceLayerService } from './services/piece-layer.service'
import { MinimumPipe } from './pipes/minimum.pipe'
import { MaximumPipe } from './pipes/maximum.pipe'
import { SofieLogoComponent } from './components/sofie-logo/sofie-logo.component'
import { SpacerComponent } from './components/spacer/spacer.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { IconButtonComponent } from './components/icon-button/icon-button.component'
import { ActionService } from './abstractions/action.service'
import { HttpActionService } from './services/http-action.service'

@NgModule({
  declarations: [HeaderComponent, ConfirmationDialogComponent, MinimumPipe, MaximumPipe, TimestampPipe, SofieLogoComponent, SpacerComponent, IconButtonComponent],
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
    FontAwesomeModule,
  ],
  exports: [CommonModule, HeaderComponent, MinimumPipe, MaximumPipe, TimestampPipe, SofieLogoComponent, SpacerComponent, IconButtonComponent],
  providers: [{ provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000, verticalPosition: 'top' } }, { provide: ActionService, useClass: HttpActionService }, DialogService, ConnectionErrorService, PieceLayerService, TimestampPipe],
})
export class SharedModule {}
