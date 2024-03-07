import { Logger } from 'src/app/core/abstractions/logger.service'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActionTrigger, ActionTriggerWithAction } from 'src/app/shared/models/action-trigger'
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

@Component({
  selector: 'sofie-keyboard-mapping-settings-page',
  templateUrl: './keyboard-mapping-settings-page.component.html',
  styleUrls: ['./keyboard-mapping-settings-page.component.scss'],
})
export class KeyboardMappingSettingsPageComponent implements OnInit, OnDestroy {
  protected readonly IconButtonSize = IconButtonSize
  protected readonly IconButton = IconButton
  protected readonly title: string = $localize`settings.keyboard-mappings.label`
  protected readonly actionTriggersFileName: string = 'action-triggers'

  public actionTriggersWithAction: ActionTriggerWithAction<KeyboardTriggerData>[]

  public readonly selectedActionTriggers: Set<ActionTriggerWithAction<KeyboardTriggerData>> = new Set()

  public readonly headers: SofieTableHeader<ActionTriggerWithAction<KeyboardTriggerData>>[] = [
    {
      name: 'Label',
      isBeingUsedForSorting: true,
      sortCallback: (a: ActionTriggerWithAction<KeyboardTriggerData>, b: ActionTriggerWithAction<KeyboardTriggerData>): number => a.actionTrigger.data.label.localeCompare(b.actionTrigger.data.label),
      sortDirection: SortDirection.DESC,
    },
    {
      name: 'Shortcut',
      sortCallback: (a: ActionTriggerWithAction<KeyboardTriggerData>, b: ActionTriggerWithAction<KeyboardTriggerData>): number =>
        a.actionTrigger.data.mappedToKeys?.toString().localeCompare(b.actionTrigger.data.mappedToKeys?.toString() ?? '') ?? 0,
      sortDirection: SortDirection.DESC,
    },
    {
      name: 'Action',
      sortCallback: (a: ActionTriggerWithAction<KeyboardTriggerData>, b: ActionTriggerWithAction<KeyboardTriggerData>): number => a.action.name.localeCompare(b.action.name),
      sortDirection: SortDirection.DESC,
    },
  ]

  public actionTriggerSearchQuery: string

  // TODO: Possible to get rid of this?
  public actions: Tv2PartAction[]

  private readonly unsubscribe$: Subject<null> = new Subject<null>()

  // TODO: Delete these
  public toBeDeletedUsedAsSelectedActionTrigger?: ActionTriggerWithAction<KeyboardTriggerData>
  public toBeDeletedIsShowingCreateActionTriggerForm: boolean

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
      .subscribe(actionTriggers => {
        this.actionTriggersWithAction = this.mapActionTriggersWithActions(actionTriggers)
        this.sortActionTriggers()
      })
  }

  private mapActionTriggersWithActions(actionTriggers: ActionTrigger[]): ActionTriggerWithAction<KeyboardTriggerData>[] {
    return actionTriggers.map(actionTrigger => {
      return {
        actionTrigger,
        action: this.actions.find(action => action.id === actionTrigger.actionId),
      } as ActionTriggerWithAction<KeyboardTriggerData>
    })
  }

  public toggleTableHeaderForSorting(header: SofieTableHeader<ActionTriggerWithAction<KeyboardTriggerData>>): void {
    header.isBeingUsedForSorting = true
    header.sortDirection = header.sortDirection === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC

    this.headers.forEach(h => {
      if (h === header) {
        return
      }
      h.isBeingUsedForSorting = false
      h.sortDirection = SortDirection.DESC
    })

    this.sortActionTriggers()
  }

  private sortActionTriggers(): void {
    const header: SofieTableHeader<ActionTriggerWithAction<KeyboardTriggerData>> | undefined = this.headers.find(header => header.isBeingUsedForSorting)
    if (!header) {
      return
    }
    this.actionTriggersWithAction.sort(header.sortCallback)
    if (header.sortDirection === SortDirection.ASC) {
      this.actionTriggersWithAction.reverse()
    }
  }

  public getSortIcon(header: SofieTableHeader<ActionTriggerWithAction<KeyboardTriggerData>>): IconButton {
    return header.sortDirection === SortDirection.ASC ? IconButton.SORT_UP : IconButton.SORT_DOWN
  }

  public toggleAllActionTriggers(isSelected: boolean): void {
    this.actionTriggersWithAction.forEach(actionTrigger => this.toggleActionTrigger(isSelected, actionTrigger))
  }

  public toggleActionTrigger(isSelected: boolean, actionTrigger: ActionTriggerWithAction<KeyboardTriggerData>): void {
    if (isSelected) {
      this.selectedActionTriggers.add(actionTrigger)
      return
    }
    this.selectedActionTriggers.delete(actionTrigger)
  }

  public isActionTriggerSelected(actionTrigger: ActionTriggerWithAction<KeyboardTriggerData>): boolean {
    return this.selectedActionTriggers.has(actionTrigger)
  }

  public isAllActionTriggersSelected(): boolean {
    if (this.actionTriggersWithAction.length === 0) {
      return false
    }
    return this.selectedActionTriggers.size === this.actionTriggersWithAction.length
  }

  public deleteActionTrigger(actionTrigger: ActionTriggerWithAction<KeyboardTriggerData>): void {
    this.dialogService.createConfirmDialog($localize`global.delete.label`, $localize`action-triggers.delete.confirmation`, $localize`global.delete.label`, () => {
      const index: number = this.actionTriggersWithAction.indexOf(actionTrigger)
      if (index < 0) {
        return
      }
      this.actionTriggersWithAction.splice(index, 1)

      this.actionTriggerService.deleteActionTrigger(actionTrigger.actionTrigger.id).subscribe()
      this.notificationService.createInfoNotification('Successfully deleted Action Trigger')
    })
  }

  public duplicateActionTrigger(actionTrigger: ActionTriggerWithAction<KeyboardTriggerData>): void {
    const index: number = this.actionTriggersWithAction.indexOf(actionTrigger)
    if (index < 0) {
      return
    }
    const clonedActionTrigger: ActionTrigger<KeyboardTriggerData> = {
      ...actionTrigger.actionTrigger,
      id: '', // Will be set by the backend
    }

    this.actionTriggerService.createActionTrigger(clonedActionTrigger).subscribe()
    this.notificationService.createInfoNotification('Successfully cloned Action Trigger')
  }

  public openEditActionTrigger(actionTrigger: ActionTriggerWithAction<KeyboardTriggerData>): void {
    // TODO: Implement
    this.logger.info(actionTrigger.actionTrigger.id)
  }

  public getActionTriggersWithoutActions(): ActionTrigger<KeyboardTriggerData>[] {
    return this.actionTriggersWithAction.map(actionTrigger => actionTrigger.actionTrigger)
  }

  public actionTriggersUploaded(actionTriggers: ActionTrigger<KeyboardTriggerData>[]): void {
    Promise.all(
      actionTriggers.map(actionTrigger => {
        const actionTriggerAlreadyExist: boolean = this.actionTriggersWithAction.some(actionTriggerWithAction => actionTriggerWithAction.actionTrigger.id === actionTrigger.id)
        actionTriggerAlreadyExist ? this.actionTriggerService.updateActionTrigger(actionTrigger).subscribe() : this.actionTriggerService.createActionTrigger(actionTrigger).subscribe()
      })
    )
      .then(() => this.notificationService.createInfoNotification('Successfully imported Action Triggers'))
      .catch(error => {
        this.logger.error(error)
        this.notificationService.createErrorNotification('Something went wrong uploading Action Triggers!')
      })
  }

  public validateActionTriggers(actionTriggers: ActionTrigger<KeyboardTriggerData>[]): boolean {
    try {
      return !!this.actionTriggerParser.parseActionTriggers(actionTriggers)
    } catch {
      return false
    }
  }

  public deleteSelectedActionTriggers(): void {
    this.dialogService.createConfirmDialog($localize`global.delete.label`, $localize`action-triggers.delete.confirmation`, $localize`global.delete.label`, () => {
      const actionTriggerIdsToBeDeleted: string[] = this.actionTriggersWithAction
        .filter(actionTrigger => this.selectedActionTriggers.has(actionTrigger))
        .map(actionTrigger => actionTrigger.actionTrigger.id)

      this.selectedActionTriggers.clear()

      Promise.all(actionTriggerIdsToBeDeleted.map(id => this.actionTriggerService.deleteActionTrigger(id).subscribe()))
        .then(() => this.notificationService.createInfoNotification('Successfully deleted all selected Action Triggers'))
        .catch(error => {
          this.logger.error(error)
          this.notificationService.createErrorNotification('Something went wrong deleting all selected Action Triggers!')
        })
    })
  }

  public doesActionTriggerMatchSearchQuery(actionTrigger: ActionTriggerWithAction<KeyboardTriggerData>): boolean {
    if (!this.actionTriggerSearchQuery || this.actionTriggerSearchQuery.length === 0) {
      return true
    }

    const lowerCasedQuery: string = this.actionTriggerSearchQuery.toLowerCase()
    const doesLabelMatchQuery: boolean = actionTrigger.actionTrigger.data.label.toLowerCase().includes(lowerCasedQuery)
    const doesShortCutMatchQuery: boolean = this.getShortcutName(actionTrigger).toLowerCase().includes(lowerCasedQuery)
    const doesActionNameMatchQuery: boolean = actionTrigger.action.name.toLowerCase().includes(lowerCasedQuery)

    return doesLabelMatchQuery || doesShortCutMatchQuery || doesActionNameMatchQuery
  }

  public getShortcutName(actionTrigger: ActionTriggerWithAction<KeyboardTriggerData>): string {
    return this.formatKeysPipe.transform(
      actionTrigger.actionTrigger.data.mappedToKeys && actionTrigger.actionTrigger.data.mappedToKeys.length > 0 ? actionTrigger.actionTrigger.data.mappedToKeys! : actionTrigger.actionTrigger.data.keys
    )
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe()
  }

  // TODO: Delete
  public selectActionTriggerForEditing(actionTrigger?: ActionTriggerWithAction<KeyboardTriggerData>): void {
    this.toBeDeletedUsedAsSelectedActionTrigger = actionTrigger
    this.toBeDeletedIsShowingCreateActionTriggerForm = false
  }

  // TODO: Delete
  public cancelActionTrigger(): void {
    this.toBeDeletedUsedAsSelectedActionTrigger = undefined
    this.toBeDeletedIsShowingCreateActionTriggerForm = false
  }
}
