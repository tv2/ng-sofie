import { Component, OnInit } from '@angular/core'
import { ActionTrigger, ActionTriggerSortKeys, KeyboardAndSelectionTriggerData } from 'src/app/shared/models/action-trigger'
import { FilesUtil } from 'src/app/helper/files.util'
import { ActionTriggerService } from 'src/app/shared/abstractions/action-trigger.service'
import { CopyUtil } from 'src/app/helper/copy.util'

@Component({
  selector: 'sofie-action-triggers',
  templateUrl: './action-triggers.component.html',
  styleUrls: ['./action-triggers.component.scss'],
})
export class ActionTriggersComponent implements OnInit {
  public selectedAction: ActionTrigger<KeyboardAndSelectionTriggerData> | null
  public createAction: boolean
  public loading: boolean
  public actionsTriggersList: ActionTrigger<KeyboardAndSelectionTriggerData>[]
  public sort: ActionTriggerSortKeys = ActionTriggerSortKeys.ACTION_ID_A_Z

  constructor(private readonly actionTriggerService: ActionTriggerService) {}

  public ngOnInit(): void {
    this.loadActionsTriggers()
  }

  private loadActionsTriggers(): void {
    this.loading = true
    this.actionTriggerService.getActionTriggers().subscribe({
      next: triggers => {
        this.actionsTriggersList = triggers.map(trigger => {
          return { ...trigger, ...{ data: { selected: false, ...trigger.data } } }
        })
        this.newSortSelect(this.sort)
        this.loading = false
      },
    })
  }

  public editActionTrigger(): void {
    this.loadActionsTriggers()
    this.cancelActionTrigger()
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
