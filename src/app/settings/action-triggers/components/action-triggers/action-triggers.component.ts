import { Logger } from 'src/app/core/abstractions/logger.service'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActionTrigger, ActionTriggerWithActionInfo, KeyboardAndSelectionTriggerData, KeyboardTriggerData } from 'src/app/shared/models/action-trigger'
import { ActionTriggerStateService } from 'src/app/core/services/action-trigger-state.service'
import { Subject, takeUntil } from 'rxjs'
import { Tv2PartAction } from 'src/app/shared/models/tv2-action'
import { ActionStateService } from 'src/app/shared/services/action-state.service'
import { HttpFileDownloadService } from 'src/app/core/services/http/http-file-download.service'

@Component({
  selector: 'sofie-action-triggers',
  templateUrl: './action-triggers.component.html',
  styleUrls: ['./action-triggers.component.scss'],
})
export class ActionTriggersComponent implements OnInit, OnDestroy {
  public selectedAction: ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData> | undefined
  public createAction: boolean
  public loading: boolean
  public actions: Tv2PartAction[]
  public actionTriggers: ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData>[]
  private readonly unsubscribe$: Subject<null> = new Subject<null>()

  constructor(
    private readonly actionTriggerStateService: ActionTriggerStateService,
    private readonly fileDownloadService: HttpFileDownloadService,
    private readonly logger: Logger,
    private readonly actionStateService: ActionStateService
  ) {}

  public ngOnInit(): void {
    this.loading = true
    this.actionStateService
      .subscribeToRundownActions('jSXbtcsHTPjebGXurMzP401Z3u0_')
      .then(observable => observable.subscribe(actions => this.onActionsChanged(actions as Tv2PartAction[])))
      .then(() => this.subscribeForActionTriggerObservable())
      .catch(error => this.logger.data(error).error('Error while listening to Action events'))
  }

  private subscribeForActionTriggerObservable(): void {
    this.actionTriggerStateService
      .getActionTriggerObservable()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: triggers => {
          this.actionTriggers = JSON.parse(
            JSON.stringify(
              (triggers as ActionTrigger<KeyboardTriggerData>[]).map(trigger => {
                return { ...trigger, ...{ data: { selected: false, ...trigger.data }, actionInfo: this.actions.find(action => action.id === trigger.actionId) } }
              })
            )
          )
          this.loading = false
        },
      })
  }

  private onActionsChanged(loadedActions: Tv2PartAction[]): void {
    this.actions = loadedActions
    this.loading = false
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next(null)
    this.unsubscribe$.unsubscribe()
  }

  public importStart(): void {
    this.loading = true
  }

  public actionTriggerSelect(selectedTrigger: ActionTriggerWithActionInfo<KeyboardAndSelectionTriggerData> | undefined): void {
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
    const triggersCopy: ActionTrigger<KeyboardTriggerData>[] = this.actionTriggers.map(actionTrigger => {
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
