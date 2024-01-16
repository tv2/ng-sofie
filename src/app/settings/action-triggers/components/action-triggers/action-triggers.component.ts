import { Logger } from 'src/app/core/abstractions/logger.service'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActionTrigger, ActionTriggerWithActionInfo } from 'src/app/shared/models/action-trigger'
import { ActionTriggerStateService } from 'src/app/core/services/action-trigger-state.service'
import { Subject, takeUntil } from 'rxjs'
import { Tv2PartAction } from 'src/app/shared/models/tv2-action'
import { ActionStateService } from 'src/app/shared/services/action-state.service'
import { HttpFileDownloadService } from 'src/app/core/services/http/http-file-download.service'
import { KeyboardTriggerData } from 'src/app/shared/models/keyboard-trigger'

@Component({
  selector: 'sofie-action-triggers',
  templateUrl: './action-triggers.component.html',
  styleUrls: ['./action-triggers.component.scss'],
})
export class ActionTriggersComponent implements OnInit, OnDestroy {
  public selectedAction: ActionTriggerWithActionInfo<KeyboardTriggerData> | undefined
  public createAction: boolean
  public loading: boolean = true
  public actions: Tv2PartAction[]
  public actionTriggers: ActionTriggerWithActionInfo<KeyboardTriggerData>[]
  private readonly unsubscribe$: Subject<null> = new Subject<null>()

  constructor(
    private readonly actionTriggerStateService: ActionTriggerStateService,
    private readonly fileDownloadService: HttpFileDownloadService,
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
      .subscribe({
        next: triggers => {
          this.actionTriggers = JSON.parse(
            JSON.stringify(
              (triggers as ActionTrigger<KeyboardTriggerData>[]).map(trigger => {
                return { ...trigger, actionInfo: this.actions.find(action => action.id === trigger.actionId) }
              })
            )
          )
          this.loading = false
        },
      })
  }

  private onActionsChanged(loadedActions: Tv2PartAction[]): void {
    this.actions = JSON.parse(JSON.stringify(loadedActions))
    this.loading = false
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next(null)
    this.unsubscribe$.unsubscribe()
  }

  public importStart(): void {
    this.loading = true
  }

  public actionTriggerSelect(selectedTrigger: ActionTriggerWithActionInfo<KeyboardTriggerData> | undefined): void {
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
