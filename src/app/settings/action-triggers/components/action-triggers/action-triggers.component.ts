import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActionTrigger, ActionTriggerSortKeys, KeyboardAndSelectionTriggerData } from 'src/app/shared/models/action-trigger'
import { FilesUtil } from 'src/app/helper/files.util'
import { CopyUtil } from 'src/app/helper/copy.util'
import { ActionTriggerStateService } from 'src/app/core/services/action-trigger-state.service'
import { Subject, takeUntil } from 'rxjs'

@Component({
  selector: 'sofie-action-triggers',
  templateUrl: './action-triggers.component.html',
  styleUrls: ['./action-triggers.component.scss'],
})
export class ActionTriggersComponent implements OnInit, OnDestroy {
  public selectedAction: ActionTrigger<KeyboardAndSelectionTriggerData> | null
  public createAction: boolean
  public loading: boolean
  public actionsTriggersList: ActionTrigger<KeyboardAndSelectionTriggerData>[]
  public sort: ActionTriggerSortKeys = ActionTriggerSortKeys.ACTION_ID_A_Z
  private readonly unsubscribe$: Subject<null> = new Subject<null>()

  constructor(private readonly actionTriggerStateService: ActionTriggerStateService) {}

  public ngOnInit(): void {
    this.actionTriggerStateService
      .getActionTriggerObservable()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: triggers => {
          this.actionsTriggersList = CopyUtil.deepCopy(
            triggers.map(trigger => {
              return { ...trigger, ...{ data: { selected: false, ...trigger.data } } }
            })
          )
          this.newSortSelect(this.sort)
          this.loading = false
        },
      })
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next(null)
    this.unsubscribe$.unsubscribe()
  }

  public importStart(): void {
    this.loading = true
  }

  public actionTriggerSelect(selectedTrigger: ActionTrigger<KeyboardAndSelectionTriggerData> | null): void {
    this.selectedAction = selectedTrigger
    this.createAction = false
  }

  public createActionTrigger(): void {
    this.createAction = true
    this.selectedAction = null
  }

  public cancelActionTrigger(): void {
    this.selectedAction = null
    this.createAction = false
  }

  public newSortSelect(sort: ActionTriggerSortKeys): void {
    this.sort = sort
    switch (sort) {
      case ActionTriggerSortKeys.ACTION_ID_A_Z:
        this.actionsTriggersList = this.actionsTriggersList.sort((a, b) => a.actionId.localeCompare(b.actionId))
        break
      case ActionTriggerSortKeys.ACTION_ID_Z_A:
        this.actionsTriggersList = this.actionsTriggersList.sort((a, b) => b.actionId.localeCompare(a.actionId))
        break
      case ActionTriggerSortKeys.SHORTCUT_A_Z:
        this.actionsTriggersList = this.actionsTriggersList.sort((a, b) => a.data?.keys.toString().localeCompare(b.data?.keys.toString()))
        break
      case ActionTriggerSortKeys.SHORTCUT_Z_A:
        this.actionsTriggersList = this.actionsTriggersList.sort((a, b) => b.data?.keys.toString().localeCompare(a.data?.keys.toString()))
        break
      default:
        this.actionsTriggersList = this.actionsTriggersList.sort((a, b) => a.actionId.localeCompare(b.actionId))
        break
    }
  }

  public exportActionsTriggers(): void {
    const triggersCopy: ActionTrigger<KeyboardAndSelectionTriggerData>[] = CopyUtil.deepCopy(this.actionsTriggersList)
    triggersCopy.map(trigger => delete trigger.data.selected)
    FilesUtil.saveText(JSON.stringify(triggersCopy), 'actions-triggers.json')
  }
}
