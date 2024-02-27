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
import { Tv2OutputLayerService } from './services/tv2-output-layer.service'
import { MinimumPipe } from './pipes/minimum.pipe'
import { MaximumPipe } from './pipes/maximum.pipe'
import { SofieLogoComponent } from './components/sofie-logo/sofie-logo.component'
import { SpacerComponent } from './components/spacer/spacer.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { IconButtonComponent } from './components/icon-button/icon-button.component'
import { DraggableShelfComponent } from './components/draggable-shelf/draggable-shelf.component'
import { ActionService } from './abstractions/action.service'
import { HttpActionService } from './services/http/http-action.service'
import { ContextMenuComponent } from './components/context-menu/context-menu.component'
import { CdkMenuModule } from '@angular/cdk/menu'
import { ActionStateService } from './services/action-state.service'
import { ActionParser } from './abstractions/action-parser.service'
import { ZodActionParser } from './services/zod-action-parser.service'
import { Tv2ActionParser } from './abstractions/tv2-action-parser.service'
import { ZodTv2ActionParser } from './services/zod-tv2-action-parser.service'
import { RundownNavigationService } from './services/rundown-navigation.service'
import { Tv2ActionPanelComponent } from './components/tv2-action-panel/tv2-action-panel.component'
import { Tv2ActionCardComponent } from './components/tv2-action-card/tv2-action-card.component'
import { TimerPipe } from './pipes/timer/timer.pipe'
import { MatSelectModule } from '@angular/material/select'
import { ActionTriggerService } from './abstractions/action-trigger.service'
import { HttpActionTriggerService } from './services/http/http-action-trigger.service'
import { ActionTriggerParser } from './abstractions/action-trigger-parser.service'
import { ZodActionTriggerParser } from './services/zod-action-trigger-parser.service'
import { HttpClientModule } from '@angular/common/http'
import { HttpErrorService } from './services/http/http-error.service'
import { Logger } from '../core/abstractions/logger.service'
import { Tv2LoggerService } from '../core/services/tv2-logger.service'
import { ConfigurationService } from './services/configuration.service'
import { HttpConfigurationService } from './services/http/http-configuration-service'
import { MediaService } from './services/media.service'
import { HttpMediaService } from './services/http/http-media.service'
import { MediaStateService } from './services/media-state.service'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { LoadingComponent } from './components/loading/loading.component'
import { DropdownButtonComponent } from './components/dropdown-button/dropdown-button.component'
import { MatMenuModule } from '@angular/material/menu'
import { CustomCheckboxComponent } from './components/icon-checkbox/custom-checkbox.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ButtonComponent } from './components/button/button.component'
import { FormatKeyboardKeysPipe } from './pipes/format-keyboard-keys.pipe'
import { SystemInformationService } from './services/system-information.service'
import { HttpSystemInformationService } from './services/http/http-system-information.service'
import { TooltipComponent } from './components/tooltip/tooltip.component'
import { ConfigurationParser } from './abstractions/configuration-parser.service'
import { ZodConfigurationParser } from './services/zod-configuration-parser.service'
import { DialogComponent } from './components/dialog/dialog.component'
import { MultiSelectComponent } from './components/multi-select/multi-select.component'
import { TranslationKnownValuesPipe } from './pipes/translation-known-values.pipe'
import { SofieTableHeaderComponent } from './components/sofie-table-header/sofie-table-header.component'

@NgModule({
  declarations: [
    HeaderComponent,
    ConfirmationDialogComponent,
    MinimumPipe,
    MaximumPipe,
    TranslationKnownValuesPipe,
    FormatKeyboardKeysPipe,
    SofieLogoComponent,
    SpacerComponent,
    IconButtonComponent,
    DraggableShelfComponent,
    ContextMenuComponent,
    Tv2ActionPanelComponent,
    Tv2ActionCardComponent,
    TimerPipe,
    LoadingComponent,
    DropdownButtonComponent,
    CustomCheckboxComponent,
    ButtonComponent,
    MultiSelectComponent,
    DialogComponent,
    SofieTableHeaderComponent,
    TooltipComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
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
    CdkMenuModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatMenuModule,
  ],
  exports: [
    CommonModule,
    HeaderComponent,
    MinimumPipe,
    TranslationKnownValuesPipe,
    MaximumPipe,
    FormatKeyboardKeysPipe,
    TimerPipe,
    SofieLogoComponent,
    SpacerComponent,
    IconButtonComponent,
    DraggableShelfComponent,
    ContextMenuComponent,
    Tv2ActionPanelComponent,
    Tv2ActionCardComponent,
    LoadingComponent,
    DropdownButtonComponent,
    CustomCheckboxComponent,
    ReactiveFormsModule,
    FormsModule,
    ButtonComponent,
    MultiSelectComponent,
    DialogComponent,
    SofieTableHeaderComponent,
    TooltipComponent,
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000, verticalPosition: 'top' } },
    { provide: Logger, useClass: Tv2LoggerService },
    { provide: ActionService, useClass: HttpActionService },
    { provide: ActionTriggerService, useClass: HttpActionTriggerService },
    { provide: ActionParser, useClass: ZodActionParser },
    { provide: ActionTriggerParser, useClass: ZodActionTriggerParser },
    { provide: Tv2ActionParser, useClass: ZodTv2ActionParser },
    { provide: ConfigurationParser, useClass: ZodConfigurationParser },
    { provide: ActionStateService, useClass: ActionStateService },
    { provide: ConfigurationService, useClass: HttpConfigurationService },
    { provide: MediaService, useClass: HttpMediaService },
    { provide: SystemInformationService, useClass: HttpSystemInformationService },
    HttpErrorService,
    HttpClientModule,
    DialogService,
    ConnectionErrorService,
    Tv2OutputLayerService,
    ActionStateService,
    MediaStateService,
    RundownNavigationService,
    TimerPipe,
    TranslationKnownValuesPipe,
  ],
})
export class SharedModule {}
