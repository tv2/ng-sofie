import { Logger } from 'src/app/core/abstractions/logger.service'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActionTrigger } from 'src/app/shared/models/action-trigger'
import { ActionTriggerStateService } from 'src/app/core/services/action-trigger-state.service'
import { Subject, takeUntil } from 'rxjs'
import { Tv2PartAction } from 'src/app/shared/models/tv2-action'
import { ActionStateService } from 'src/app/shared/services/action-state.service'
import { KeyboardTriggerData } from 'src/app/shared/models/keyboard-trigger'
import { SofieTableHeader, SortDirection } from '../../../../shared/components/table/table.component'
import { IconButton, IconButtonSize } from '../../../../shared/enums/icon-button'
import { DialogService } from '../../../../shared/services/dialog.service'
import { ActionTriggerService } from '../../../../shared/abstractions/action-trigger.service'
import { NotificationService } from '../../../../shared/services/notification.service'
import { ActionTriggerParser } from '../../../../shared/abstractions/action-trigger-parser.service'
import { FormatKeyboardKeysPipe } from '../../../../shared/pipes/format-keyboard-keys.pipe'
import { EditKeyboardMappingDialogComponent } from '../edit-keyboard-mapping-dialog/edit-keyboard-mapping-dialog.component'

export interface KeyboardMapping {
  actionTrigger: ActionTrigger<KeyboardTriggerData>
  action: Tv2PartAction
}

@Component({
  selector: 'sofie-keyboard-mapping-settings-page',
  templateUrl: './keyboard-mapping-settings-page.component.html',
})
export class KeyboardMappingSettingsPageComponent implements OnInit, OnDestroy {
  protected readonly IconButtonSize = IconButtonSize
  protected readonly IconButton = IconButton
  protected readonly title: string = $localize`settings.keyboard-mappings.label`
  protected readonly keyboardMappingsFileName: string = 'keyboard-mappings'

  public keyboardMappings: KeyboardMapping[]

  public selectedKeyboardMappings: Set<KeyboardMapping> = new Set()

  public readonly headers: SofieTableHeader<KeyboardMapping>[] = [
    {
      name: 'Label',
      isBeingUsedForSorting: true,
      sortCallback: (a: KeyboardMapping, b: KeyboardMapping): number => a.actionTrigger.data.label.localeCompare(b.actionTrigger.data.label),
      sortDirection: SortDirection.DESC,
    },
    {
      name: 'Shortcut',
      sortCallback: (a: KeyboardMapping, b: KeyboardMapping): number => a.actionTrigger.data.mappedToKeys?.toString().localeCompare(b.actionTrigger.data.mappedToKeys?.toString() ?? '') ?? 0,
      sortDirection: SortDirection.DESC,
    },
    {
      name: 'Action',
      sortCallback: (a: KeyboardMapping, b: KeyboardMapping): number => a.action.name.localeCompare(b.action.name),
      sortDirection: SortDirection.DESC,
    },
  ]

  public keyboardMappingSearchQuery: string

  public actions: Tv2PartAction[]

  private readonly unsubscribe$: Subject<null> = new Subject<null>()

  constructor(
    private readonly actionTriggerStateService: ActionTriggerStateService,
    private readonly actionTriggerService: ActionTriggerService,
    private readonly actionTriggerParser: ActionTriggerParser,
    private readonly actionStateService: ActionStateService,
    private readonly dialogService: DialogService,
    private readonly notificationService: NotificationService,
    private readonly formatKeysPipe: FormatKeyboardKeysPipe,
    private readonly logger: Logger
  ) {}

  public ngOnInit(): void {
    this.actionStateService
      .subscribeToSystemActions()
      .then(observable => observable.subscribe(actions => (this.actions = actions as Tv2PartAction[])))
      .then(() => this.subscribeForActionTriggerObservable())
      .catch(error => this.logger.data(error).error('Error while listening to Action events'))
  }

  private subscribeForActionTriggerObservable(): void {
    this.actionTriggerStateService
      .getActionTriggerObservable()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(actionTriggers => (this.keyboardMappings = this.mapActionTriggersToKeyboardMappings(actionTriggers)))
  }

  private mapActionTriggersToKeyboardMappings(actionTriggers: ActionTrigger[]): KeyboardMapping[] {
    return actionTriggers.map(actionTrigger => {
      return {
        actionTrigger,
        action: this.actions.find(action => action.id === actionTrigger.actionId),
      } as KeyboardMapping
    })
  }

  public deleteKeyboardMapping(actionTrigger: KeyboardMapping): void {
    this.dialogService.createConfirmDialog($localize`global.delete.label`, $localize`keyboard-mapping.delete.confirmation`, $localize`global.delete.label`, () => {
      const index: number = this.keyboardMappings.indexOf(actionTrigger)
      if (index < 0) {
        return
      }
      this.keyboardMappings.splice(index, 1)

      this.actionTriggerService.deleteActionTrigger(actionTrigger.actionTrigger.id).subscribe()
      this.notificationService.createInfoNotification('Successfully deleted Keyboard Mapping')
    })
  }

  public duplicateKeyboardMapping(keyboardMapping: KeyboardMapping): void {
    const index: number = this.keyboardMappings.indexOf(keyboardMapping)
    if (index < 0) {
      return
    }
    const clonedActionTriggerFromKeyboardMapping: ActionTrigger<KeyboardTriggerData> = {
      ...keyboardMapping.actionTrigger,
      id: '', // Will be set by the backend
    }

    this.actionTriggerService.createActionTrigger(clonedActionTriggerFromKeyboardMapping).subscribe()
    this.notificationService.createInfoNotification('Successfully cloned Action Trigger')
  }

  public openCreateKeyboardMapping(): void {
    this.dialogService.openSidebarDialog<EditKeyboardMappingDialogComponent, KeyboardMapping>(EditKeyboardMappingDialogComponent, (result?: KeyboardMapping) => {
      if (!result) {
        return
      }
      this.actionTriggerService.createActionTrigger(result.actionTrigger).subscribe()
      this.notificationService.createInfoNotification('Successfully created Keyboard Mapping')
    })
  }

  public openEditKeyboardMapping(keyboardMapping: KeyboardMapping): void {
    this.dialogService.openSidebarDialog<EditKeyboardMappingDialogComponent, KeyboardMapping>(
      EditKeyboardMappingDialogComponent,
      (result?: KeyboardMapping) => {
        if (!result) {
          return
        }
        this.actionTriggerService.updateActionTrigger(result.actionTrigger).subscribe()
        this.notificationService.createInfoNotification('Successfully updated Keyboard Mapping')
      },
      keyboardMapping
    )
  }

  public getActionTriggersFromKeyboardMappings(): ActionTrigger<KeyboardTriggerData>[] {
    return this.keyboardMappings.map(keyboardMapping => keyboardMapping.actionTrigger)
  }

  public actionTriggersUploaded(actionTriggers: ActionTrigger<KeyboardTriggerData>[]): void {
    Promise.all(
      actionTriggers.map(actionTrigger => {
        const actionTriggerAlreadyExist: boolean = this.keyboardMappings.some(actionTriggerWithAction => actionTriggerWithAction.actionTrigger.id === actionTrigger.id)
        actionTriggerAlreadyExist ? this.actionTriggerService.updateActionTrigger(actionTrigger).subscribe() : this.actionTriggerService.createActionTrigger(actionTrigger).subscribe()
      })
    )
      .then(() => this.notificationService.createInfoNotification('Successfully imported Keyboard Mappings'))
      .catch(error => {
        this.logger.error(error)
        this.notificationService.createErrorNotification('Something went wrong uploading Keyboard Mappings!')
      })
  }

  public validateActionTriggers(actionTriggers: ActionTrigger<KeyboardTriggerData>[]): boolean {
    try {
      return !!this.actionTriggerParser.parseActionTriggers(actionTriggers)
    } catch {
      return false
    }
  }

  public deleteSelectedKeyboardMapping(): void {
    this.dialogService.createConfirmDialog($localize`global.delete.label`, $localize`keyboard-mapping.delete-selected.confirmation`, $localize`global.delete.label`, () => {
      const actionTriggerIdsToBeDeleted: string[] = this.keyboardMappings
        .filter(keyboardMapping => this.selectedKeyboardMappings.has(keyboardMapping))
        .map(keyboardMapping => keyboardMapping.actionTrigger.id)

      this.selectedKeyboardMappings.clear()

      Promise.all(actionTriggerIdsToBeDeleted.map(id => this.actionTriggerService.deleteActionTrigger(id).subscribe()))
        .then(() => this.notificationService.createInfoNotification('Successfully deleted all selected Keyboard Mappings'))
        .catch(error => {
          this.logger.error(error)
          this.notificationService.createErrorNotification('Something went wrong deleting all selected Keyboard Mappings!')
        })
    })
  }

  public doesKeyboardMappingMatchSearchQuery(keyboardMapping: KeyboardMapping): boolean {
    if (!this.keyboardMappingSearchQuery || this.keyboardMappingSearchQuery.length === 0) {
      return true
    }

    const lowerCasedQuery: string = this.keyboardMappingSearchQuery.toLowerCase()
    const doesLabelMatchQuery: boolean = keyboardMapping.actionTrigger.data.label.toLowerCase().includes(lowerCasedQuery)
    const doesShortCutMatchQuery: boolean = this.getShortcutName(keyboardMapping).toLowerCase().includes(lowerCasedQuery)
    const doesActionNameMatchQuery: boolean = keyboardMapping.action.name.toLowerCase().includes(lowerCasedQuery)

    return doesLabelMatchQuery || doesShortCutMatchQuery || doesActionNameMatchQuery
  }

  public getKeyboardMappingName(keyboardMapping: KeyboardMapping): string {
    if (keyboardMapping.actionTrigger.data.label && keyboardMapping.actionTrigger.data.label.length > 0) {
      return keyboardMapping.actionTrigger.data.label
    }
    return keyboardMapping.action.name
  }

  public getShortcutName(keyboardMapping: KeyboardMapping): string {
    return this.formatKeysPipe.transform(
      keyboardMapping.actionTrigger.data.mappedToKeys && keyboardMapping.actionTrigger.data.mappedToKeys.length > 0
        ? keyboardMapping.actionTrigger.data.mappedToKeys!
        : keyboardMapping.actionTrigger.data.keys
    )
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe()
  }
}
