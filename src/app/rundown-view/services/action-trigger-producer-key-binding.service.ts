import { Injectable } from '@angular/core'
import { Observable, of, SubscriptionLike } from 'rxjs'
import { KeyBinding } from 'src/app/keyboard/value-objects/key-binding'
import { KeyBindingService } from '../abstractions/key-binding.service'
import { ActionTriggerStateService } from '../../core/services/action-trigger-state.service'
import { ActionStateService } from '../../shared/services/action-state.service'
import { ActionTrigger } from '../../shared/models/action-trigger'

@Injectable()
export class ActionTriggerProducerKeyBindingService implements KeyBindingService {

  private actionTriggerSubscription: SubscriptionLike

  constructor(
    private readonly actionTriggerStateService: ActionTriggerStateService,
    private readonly actionStateService: ActionStateService
  ) {
  }

  public init(rundownId: string): void {
    this.actionTriggerSubscription =this.actionTriggerStateService.getActionTriggerObservable()
      .subscribe((actionTriggers: ActionTrigger[]) => {
        console.log(`### Got new ActionTriggers:`)
        console.log(actionTriggers)
      })
  }

  public subscribeToKeyBindings(): Observable<KeyBinding[]> {
    return of([])
  }

  public destroy(): void {
    this.actionTriggerSubscription.unsubscribe()
  }
}
