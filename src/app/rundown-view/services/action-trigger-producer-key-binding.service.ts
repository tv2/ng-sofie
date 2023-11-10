import { Injectable } from '@angular/core'
import { ActionStateService } from '../../shared/services/action-state.service'
import { KeyBindingFactory } from '../factories/key-binding.factory'
import { Tv2ActionParser } from '../../shared/abstractions/tv2-action-parser.service'
import { RundownStateService } from '../../core/services/rundown-state.service'
import { ActionTriggerService } from '../../shared/abstractions/action-trigger.service'
import { KeyBindingService } from '../abstractions/key-binding.service'
import { BehaviorSubject, Observable, Subject, SubscriptionLike } from 'rxjs'
import { KeyBinding } from '../../keyboard/value-objects/key-binding'
import { Logger } from '../../core/abstractions/logger.service'
import { Action, ActionTrigger } from '../../shared/models/action'
import { Tv2Action, Tv2ActionContentType } from '../../shared/models/tv2-action'
import { Rundown } from '../../core/models/rundown'
import { StyledKeyBinding } from '../../keyboard/value-objects/styled-key-binding'
import { ActionService } from '../../shared/abstractions/action.service'

const CAMERA_COLOR: string = '#005919'
const REMOTE_COLOR: string = '#ac29a5'

@Injectable()
export class ActionTriggerProducerKeyBindingService implements KeyBindingService {
  private actionTriggers: ActionTrigger[] = []
  private actions: Tv2Action[] = []
  private readonly actionTriggersWithAction: Map<ActionTrigger, Tv2Action> = new Map()

  private rundown?: Rundown

  private readonly keyBindingsSubject: Subject<KeyBinding[]>
  private keyBindings: KeyBinding[] = []
  private actionsSubscription?: SubscriptionLike
  private rundownSubscription?: SubscriptionLike
  private readonly logger: Logger

  constructor(
    private readonly actionStateService: ActionStateService,
    private readonly keyBindingFactory: KeyBindingFactory,
    private readonly tv2ActionParser: Tv2ActionParser,
    private readonly rundownStateService: RundownStateService,
    private readonly actionTriggerService: ActionTriggerService,
    private readonly actionService: ActionService,
    logger: Logger
  ) {
    this.logger = logger.tag('ActionTriggerProducerKeyBindingService')
    this.keyBindingsSubject = new BehaviorSubject(this.keyBindings)
  }

  public init(rundownId: string): void {
    this.actionTriggerService.getActionTriggers().subscribe(actionTriggers => {
      this.actionTriggers = actionTriggers
      this.mapActionTriggersToActions()
    })

    this.actionStateService
      .subscribeToRundownActions(rundownId, this.onActionsChanged.bind(this))
      .then(subscription => (this.actionsSubscription = subscription))
      .catch(error => this.logger.data(error).error('Encountered an error while subscribing to actions.'))

    this.rundownStateService
      .subscribeToRundown(rundownId, this.onRundownChanged.bind(this))
      .then(subscription => (this.rundownSubscription = subscription))
      .catch(error => this.logger.data(error).error(`Encountered an error while subscribing to rundown with id '${rundownId}'.`))
  }

  private mapActionTriggersToActions(): void {
    if (this.actions.length === 0 || this.actionTriggers.length === 0) {
      return
    }
    this.actionTriggersWithAction.clear()

    this.actionTriggers.forEach(actionTrigger => {
      const actionForTrigger: Tv2Action | undefined = this.actions.find(action => action.id === actionTrigger.actionId)
      if (!actionForTrigger) {
        return
      }
      this.actionTriggersWithAction.set(actionTrigger, actionForTrigger)
    })
  }

  private onActionsChanged(actions: Action[]): void {
    this.actions = actions.reduce((tv2Actions: Tv2Action[], action: Action) => {
      try {
        return [...tv2Actions, this.tv2ActionParser.parseTv2Action(action)]
      } catch (error) {
        this.logger.data({ error, action }).warn('Received invalid Tv2Action')
      }
      return tv2Actions
    }, [] as Tv2Action[])
    this.mapActionTriggersToActions()

    this.keyBindings = this.createKeyBindings()
    this.keyBindingsSubject.next(this.keyBindings)
  }

  private createKeyBindings(): KeyBinding[] {
    if (!this.rundown) {
      return []
    }

    const keyBindings: StyledKeyBinding[] = this.keyBindingFactory.createRundownKeyBindings(this.rundown)

    if (!this.rundown.isActive) {
      return keyBindings
    }

    this.actionTriggersWithAction.forEach((action: Tv2Action, actionTrigger: ActionTrigger) => {
      keyBindings.push(this.createBinding(action, actionTrigger, this.rundown!.id))
    })
    return keyBindings
  }

  private createBinding(action: Tv2Action, actionTrigger: ActionTrigger, rundownId: string): StyledKeyBinding {
    return {
      keys: actionTrigger.triggerData.keys,
      label: action.name,
      onMatched: () => this.actionService.executeAction(action.id, rundownId).subscribe(),
      shouldMatchOnKeyRelease: true,
      shouldPreventDefaultBehaviourOnKeyPress: true,
      shouldPreventDefaultBehaviourForPartialMatches: true,
      useExclusiveMatching: true,
      useOrderedMatching: false,
      background: this.getKeyBindingBackgroundColour(action),
    }
  }

  private getKeyBindingBackgroundColour(action: Tv2Action): string {
    switch (action.metadata.contentType) {
      case Tv2ActionContentType.CAMERA: {
        return CAMERA_COLOR
      }
      case Tv2ActionContentType.REMOTE: {
        return REMOTE_COLOR
      }
      default: {
        return ''
      }
    }
  }

  private onRundownChanged(rundown: Rundown): void {
    this.rundown = rundown
    this.keyBindings = this.createKeyBindings()
    this.keyBindingsSubject.next(this.keyBindings)
  }

  public subscribeToKeyBindings(): Observable<KeyBinding[]> {
    return this.keyBindingsSubject.asObservable()
  }

  public destroy(): void {
    this.keyBindingsSubject.complete()
    this.actionStateService.destroy()
    this.actionsSubscription?.unsubscribe()
    this.rundownSubscription?.unsubscribe()
  }
}
