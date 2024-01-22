import { Logger } from 'src/app/core/abstractions/logger.service'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActionTrigger, ActionTriggerWithAction } from 'src/app/shared/models/action-trigger'
import { ActionTriggerStateService } from 'src/app/core/services/action-trigger-state.service'
import { Subject, takeUntil } from 'rxjs'
import { Tv2PartAction } from 'src/app/shared/models/tv2-action'
import { ActionStateService } from 'src/app/shared/services/action-state.service'
import { KeyboardTriggerData } from 'src/app/shared/models/keyboard-trigger'
import { FileDownloadService } from 'src/app/core/abstractions/file-download.service'

@Component({
  selector: 'sofie-action-triggers',
  templateUrl: './action-triggers.component.html',
  styleUrls: ['./action-triggers.component.scss'],
})
export class ActionTriggersComponent implements OnInit, OnDestroy {
  public selectedAction?: ActionTriggerWithAction<KeyboardTriggerData>
  public createAction: boolean
  public loading: boolean = true
  public actions: Tv2PartAction[]
  public actionTriggersWithAction: ActionTriggerWithAction<KeyboardTriggerData>[]
  private readonly unsubscribe$: Subject<null> = new Subject<null>()

  constructor(
    private readonly actionTriggerStateService: ActionTriggerStateService,
    private readonly fileDownloadService: FileDownloadService,
    private readonly logger: Logger,
    private readonly actionStateService: ActionStateService
  ) {}

  public ngOnInit(): void {
    this.actionStateService
      .subscribeToRundownActions()
      .then(observable => observable.subscribe(actions => this.onActionsChanged(actions as Tv2PartAction[])))
      .then(() => this.subscribeForActionTriggerObservable())
      .catch(error => this.logger.data(error).error('Error while listening to Action events'))
  }

  private subscribeForActionTriggerObservable(): void {
    this.actionTriggerStateService
      .getActionTriggerObservable()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(actionTriggers => {
        this.actionTriggersWithAction = JSON.parse(
          JSON.stringify(
            (actionTriggers as ActionTrigger<KeyboardTriggerData>[]).map(actionTrigger => {
              return { actionTrigger: { ...actionTrigger }, action: this.actions.find(action => action.id === actionTrigger.actionId) }
            })
          )
        )
        this.setIsLoading(false)
      })
  }

  private onActionsChanged(loadedActions: Tv2PartAction[]): void {
    this.actions = JSON.parse(JSON.stringify(loadedActions))
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next(null)
    this.unsubscribe$.unsubscribe()
  }

  public setIsLoading(isLoading: boolean): void {
    this.loading = isLoading
  }

  public selectActionTriggerForEditing(selectedTrigger?: ActionTriggerWithAction<KeyboardTriggerData>): void {
    this.selectedAction = selectedTrigger
    this.createAction = false
  }

  public createActionTrigger(): void {
    this.createAction = true
    this.selectedAction = undefined
  }

  public cancelActionTrigger(): void {
    this.selectedAction = undefined
    this.createAction = false
  }

  public exportActionsTriggers(): void {
    const triggersCopy: ActionTrigger<KeyboardTriggerData>[] = this.actionTriggersWithAction.map(actionTriggerWithActions => {
      const actionTrigger = actionTriggerWithActions.actionTrigger
      return {
        actionId: actionTrigger.actionId,
        id: actionTrigger.id,
        data: {
          keys: actionTrigger.data.keys,
          actionArguments: actionTrigger.data.actionArguments,
          label: actionTrigger.data.label,
          triggerOn: actionTrigger.data.triggerOn,
          mappedToKeys: actionTrigger.data.mappedToKeys,
        },
      }
    })
    this.fileDownloadService.downloadText(JSON.stringify(triggersCopy), 'actions-triggers.json')
  }
}
