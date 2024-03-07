import { NgModule } from '@angular/core'
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ButtonComponent } from './components/button/button.component'
import { FormatKeyboardKeysPipe } from './pipes/format-keyboard-keys.pipe'
import { SystemInformationService } from './services/system-information.service'
import { HttpSystemInformationService } from './services/http/http-system-information.service'
import { TooltipComponent } from './components/tooltip/tooltip.component'
import { ConfigurationParser } from './abstractions/configuration-parser.service'
import { ZodConfigurationParser } from './services/zod-configuration-parser.service'
import { NotificationPanelComponent } from './components/notification-panel/notification-panel.component'
import { NotificationCardComponent } from './components/notification-card/notification-card.component'
import { NotificationPopupContainerComponent } from './components/notification-popup-container/notification-popup-container.component'
import { NotificationIconComponent } from './components/notification-icon/notification-icon.component'
import { NotificationPopupComponent } from './components/notification-popup-component/notification-popup.component'
import { TranslationActionTypePipe } from './pipes/translation-known-values.pipe'
import { CardComponent } from './components/card/card.component'
import { TableComponent } from './components/table/table.component'
import { RoundedBoxComponent } from './components/badge/rounded-box.component'
import { ActionContentCssColorPipe } from './pipes/action-content-css-color.pipe'
import { SidebarContainerComponent } from './components/sidebar-container/sidebar-container.component'
import { TextInputComponent } from './components/text-input/text-input.component'
import { NumberInputComponent } from './components/number-input/number-input.component'
import { ButtonGroupComponent } from './components/button-group/button-group.component'
import { MultiSelectComponent } from './components/multi-select/multi-select.component'
import { DomFileDownloadService } from './services/dom-file-download.service'
import { FileDownloadService } from './abstractions/file-download.service'
import { JsonImportButtonComponent } from './components/json-import-button/json-import-button.component'
import { JsonExportButtonComponent } from './components/json-export-button/json-export-button.component'
import { CheckboxComponent } from './components/checkbox/checkbox.component'

@NgModule({
  declarations: [
    HeaderComponent,
    ConfirmationDialogComponent,
    MinimumPipe,
    MaximumPipe,
    TranslationActionTypePipe,
    FormatKeyboardKeysPipe,
    SofieLogoComponent,
    SpacerComponent,
    IconButtonComponent,
    DraggableShelfComponent,
    ContextMenuComponent,
    TimerPipe,
    LoadingComponent,
    DropdownButtonComponent,
    CheckboxComponent,
    ButtonComponent,
    TooltipComponent,
    NotificationPopupContainerComponent,
    NotificationCardComponent,
    NotificationPanelComponent,
    NotificationCardComponent,
    NotificationIconComponent,
    NotificationPopupComponent,
    CardComponent,
    TableComponent,
    RoundedBoxComponent,
    ActionContentCssColorPipe,
    SidebarContainerComponent,
    TextInputComponent,
    NumberInputComponent,
    ButtonGroupComponent,
    MultiSelectComponent,
    JsonImportButtonComponent,
    JsonExportButtonComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
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
    TranslationActionTypePipe,
    MaximumPipe,
    FormatKeyboardKeysPipe,
    TimerPipe,
    SofieLogoComponent,
    SpacerComponent,
    IconButtonComponent,
    DraggableShelfComponent,
    ContextMenuComponent,
    LoadingComponent,
    DropdownButtonComponent,
    CheckboxComponent,
    ReactiveFormsModule,
    FormsModule,
    ButtonComponent,
    TooltipComponent,
    NotificationPopupContainerComponent,
    NotificationPanelComponent,
    NotificationIconComponent,
    CardComponent,
    TableComponent,
    RoundedBoxComponent,
    ActionContentCssColorPipe,
    ButtonGroupComponent,
    MultiSelectComponent,
    JsonImportButtonComponent,
    JsonExportButtonComponent,
    TextInputComponent,
    NumberInputComponent,
    SidebarContainerComponent,
  ],
  providers: [
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
    { provide: FileDownloadService, useClass: DomFileDownloadService },
    HttpErrorService,
    HttpClientModule,
    DialogService,
    ConnectionErrorService,
    Tv2OutputLayerService,
    ActionStateService,
    MediaStateService,
    RundownNavigationService,
    TimerPipe,
    TranslationActionTypePipe,
  ],
})
export class SharedModule {}
