import { Logger } from 'src/app/core/abstractions/logger.service'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActionTrigger } from 'src/app/shared/models/action-trigger'
import { ActionTriggerStateService } from 'src/app/core/services/action-trigger-state.service'
import { Subject, takeUntil } from 'rxjs'
import { Tv2PartAction } from 'src/app/shared/models/tv2-action'
import { ActionStateService } from 'src/app/shared/services/action-state.service'
import { KeyboardTriggerData } from 'src/app/shared/models/keyboard-trigger-data'
import { SofieTableHeader, SortDirection } from '../../../../shared/components/table/table.component'
import { Icon, IconSize } from '../../../../shared/enums/icon'
import { DialogService } from '../../../../shared/services/dialog.service'
import { ActionTriggerService } from '../../../../shared/abstractions/action-trigger.service'
import { NotificationService } from '../../../../shared/services/notification.service'
import { ActionTriggerParser } from '../../../../shared/abstractions/action-trigger-parser.service'
import { FormatKeyboardKeysPipe } from '../../../../shared/pipes/format-keyboard-keys.pipe'
import { EditKeyboardMappingDialogComponent } from '../edit-keyboard-mapping-dialog/edit-keyboard-mapping-dialog.component'
import { DialogColorScheme, DialogSeverity } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component'

export interface KeyboardMapping {
  actionTrigger: ActionTrigger<KeyboardTriggerData>
  action: Tv2PartAction
}

@Component({
  selector: 'sofie-keyboard-mapping-settings-page',
  templateUrl: './keyboard-mapping-settings-page.component.html',
})
export class KeyboardMappingSettingsPageComponent implements OnInit, OnDestroy {
  protected readonly IconSize = IconSize
  protected readonly Icon = Icon
  protected readonly keyboardMappingsFileName: string = 'keyboard-mappings'

  public keyboardMappings: KeyboardMapping[]

  public selectedKeyboardMappings: Set<KeyboardMapping> = new Set()

  public readonly headers: SofieTableHeader<KeyboardMapping>[] = [
    {
      name: 'Label',
      sortCallback: (a: KeyboardMapping, b: KeyboardMapping): number => a.actionTrigger.data.label.localeCompare(b.actionTrigger.data.label),
      sortDirection: SortDirection.DESC,
    },
    {
      name: 'Shortcut',
      sortCallback: (a: KeyboardMapping, b: KeyboardMapping): number => a.actionTrigger.data.mappedToKeys?.toString().localeCompare(b.actionTrigger.data.mappedToKeys?.toString() ?? '') ?? 0,
    },
    {
      name: 'Action',
      sortCallback: (a: KeyboardMapping, b: KeyboardMapping): number => a.action.name.localeCompare(b.action.name),
    },
  ]

  public searchQuery: string

  public actions: Tv2PartAction[]

  private readonly unsubscribeSubject: Subject<void> = new Subject()

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
      .then(observable => observable.subscribe(actions => (this.actions = actions as Tv2PartAction[])).unsubscribe())
      .then(() => this.subscribeForActionTriggerObservable())
      .catch(error => this.logger.data(error).error('Error while listening to Action events'))
  }

  private subscribeForActionTriggerObservable(): void {
    this.actionTriggerStateService
      .getActionTriggerObservable()
      .pipe(takeUntil(this.unsubscribeSubject))
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
    this.dialogService.createConfirmDialog(
      $localize`global.delete.label`,
      $localize`keyboard-mapping.delete.confirmation`,
      $localize`global.delete.label`,
      () => {
        const index: number = this.keyboardMappings.indexOf(actionTrigger)
        if (index < 0) {
          return
        }
        this.keyboardMappings.splice(index, 1)

        this.actionTriggerService.deleteActionTrigger(actionTrigger.actionTrigger.id).subscribe()
        this.notificationService.createInfoNotification($localize`keyboard-mapping-settings-page.delete-keyboard-mapping.success`)
      },
      DialogColorScheme.LIGHT,
      DialogSeverity.INFO
    )
  }

  public duplicateKeyboardMapping(keyboardMapping: KeyboardMapping): void {
    const index: number = this.keyboardMappings.indexOf(keyboardMapping)
    if (index < 0) {
      return
    }
    const duplicatedActionTriggerFromKeyboardMapping: ActionTrigger<KeyboardTriggerData> = {
      ...keyboardMapping.actionTrigger,
      id: '', // Will be set by the backend
    }

    this.actionTriggerService.createActionTrigger(duplicatedActionTriggerFromKeyboardMapping).subscribe()
    this.notificationService.createInfoNotification($localize`keyboard-mapping-settings-page.duplicate-keyboard-mapping.success`)
  }

  public openCreateKeyboardMapping(): void {
    this.dialogService.openSidebarDialog(EditKeyboardMappingDialogComponent, (createdKeyboardMapping?: KeyboardMapping) => {
      if (!createdKeyboardMapping) {
        return
      }
      this.actionTriggerService.createActionTrigger(createdKeyboardMapping.actionTrigger).subscribe()
      this.notificationService.createInfoNotification($localize`keyboard-mapping-settings-page.create-keyboard-mapping.success`)
    })
  }

  public openEditKeyboardMapping(keyboardMapping: KeyboardMapping): void {
    this.dialogService.openSidebarDialog(
      EditKeyboardMappingDialogComponent,
      (updatedKeyboardMapping?: KeyboardMapping) => {
        if (!updatedKeyboardMapping) {
          return
        }
        this.actionTriggerService.updateActionTrigger(updatedKeyboardMapping.actionTrigger).subscribe()
        this.notificationService.createInfoNotification($localize`keyboard-mapping-settings-page.update-keyboard-mapping.success`)
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
        return actionTriggerAlreadyExist ? this.actionTriggerService.updateActionTrigger(actionTrigger).subscribe() : this.actionTriggerService.createActionTrigger(actionTrigger).subscribe()
      })
    )
      .then(() => this.notificationService.createInfoNotification($localize`keyboard-mapping-settings-page.import-keyboard-mappings.success`))
      .catch(error => {
        this.logger.data(error).error('Failed importing one or more keyboard mappings.')
        this.notificationService.createErrorNotification($localize`keyboard-mapping-settings-page.import-keyboard-mappings.failure`)
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
    this.dialogService.createConfirmDialog(
      $localize`global.delete.label`,
      $localize`keyboard-mapping.delete-selected.confirmation`,
      $localize`global.delete.label`,
      () => {
        const actionTriggerIdsToBeDeleted: string[] = this.keyboardMappings
          .filter(keyboardMapping => this.selectedKeyboardMappings.has(keyboardMapping))
          .map(keyboardMapping => keyboardMapping.actionTrigger.id)

        this.selectedKeyboardMappings.clear()

        Promise.all(actionTriggerIdsToBeDeleted.map(id => this.actionTriggerService.deleteActionTrigger(id).subscribe()))
          .then(() => this.notificationService.createInfoNotification($localize`keyboard-mapping-settings-page.delete-all-keyboard-mappings.success ${actionTriggerIdsToBeDeleted.length}`))
          .catch(error => {
            this.logger.data(error).error('Failed deleting one or more of teh selected keyboard mappings.')
            this.notificationService.createErrorNotification($localize`keyboard-mapping-settings-page.delete-all-keyboard-mappings.fail`)
          })
      },
      DialogColorScheme.LIGHT,
      DialogSeverity.INFO
    )
  }

  public doesKeyboardMappingMatchSearchQuery(keyboardMapping: KeyboardMapping): boolean {
    if (!this.searchQuery) {
      return true
    }

    const lowerCasedQuery: string = this.searchQuery.toLowerCase()
    const doesLabelMatchQuery: boolean = keyboardMapping.actionTrigger.data.label.toLowerCase().includes(lowerCasedQuery)
    const doesShortcutMatchQuery: boolean = this.getShortcutName(keyboardMapping).toLowerCase().includes(lowerCasedQuery)
    const doesActionNameMatchQuery: boolean = keyboardMapping.action.name.toLowerCase().includes(lowerCasedQuery)

    return doesLabelMatchQuery || doesShortcutMatchQuery || doesActionNameMatchQuery
  }

  public getKeyboardMappingName(keyboardMapping: KeyboardMapping): string {
    if (keyboardMapping.actionTrigger.data.label) {
      return keyboardMapping.actionTrigger.data.label
    }
    return keyboardMapping.action.name
  }

  public getShortcutName(keyboardMapping: KeyboardMapping): string {
    return this.formatKeysPipe.transform(
      keyboardMapping.actionTrigger.data.mappedToKeys && keyboardMapping.actionTrigger.data.mappedToKeys.length > 0
        ? keyboardMapping.actionTrigger.data.mappedToKeys
        : keyboardMapping.actionTrigger.data.keys
    )
  }

  public ngOnDestroy(): void {
    this.unsubscribeSubject.next()
    this.unsubscribeSubject.unsubscribe()
  }
}
