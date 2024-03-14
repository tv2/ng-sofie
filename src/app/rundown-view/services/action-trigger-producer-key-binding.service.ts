import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, Subject, SubscriptionLike } from 'rxjs'
import { KeyBinding } from 'src/app/keyboard/value-objects/key-binding'
import { KeyBindingService } from '../abstractions/key-binding.service'
import { ActionTriggerStateService } from '../../core/services/action-trigger-state.service'
import { ActionStateService } from '../../shared/services/action-state.service'
import { ActionTrigger } from '../../shared/models/action-trigger'
import { Action } from '../../shared/models/action'
import { RundownStateService } from '../../core/services/rundown-state.service'
import { Rundown } from '../../core/models/rundown'
import { Tv2ActionParser } from '../../shared/abstractions/tv2-action-parser.service'
import { KeyBindingFactory } from '../factories/key-binding.factory'
import { Tv2Action, Tv2ActionContentType } from '../../shared/models/tv2-action'
import { Logger } from '../../core/abstractions/logger.service'
import { StyledKeyBinding } from '../../keyboard/value-objects/styled-key-binding'
import { ActionService } from '../../shared/abstractions/action.service'
import { KeyboardTriggerData } from 'src/app/shared/models/keyboard-trigger'
import { RundownMode } from '../../core/enums/rundown-mode'

const CAMERA_COLOR: string = 'var(--tv2-camera-color)'
const REMOTE_COLOR: string = 'var(--tv2-remote-color)'
const SPLIT_SCREEN_COLOR: string = 'var(--tv2-split-screen-upper)'
const REPLAY_COLOR: string = 'var(--tv2-replay-color)'
const VIDEO_CLIP_COLOR: string = 'var(--tv2-video-clip-color)'
const GRAPHICS_COLOR: string = 'var(--tv2-graphics-color)'

@Injectable()
export class ActionTriggerProducerKeyBindingService implements KeyBindingService {
  private actions: Tv2Action[] = []
  private rundown?: Rundown
  private keyBindings: KeyBinding[] = []
  private readonly keyBindingsSubject: Subject<KeyBinding[]>

  private actionTriggers: ActionTrigger<KeyboardTriggerData>[] = []
  private readonly actionTriggersWithAction: Map<ActionTrigger<KeyboardTriggerData>, Tv2Action> = new Map()

  private actionTriggerSubscription?: SubscriptionLike
  private actionSubscription?: SubscriptionLike
  private rundownSubscription?: SubscriptionLike

  private readonly logger: Logger

  constructor(
    private readonly actionTriggerStateService: ActionTriggerStateService,
    private readonly actionStateService: ActionStateService,
    private readonly rundownStateService: RundownStateService,
    private readonly actionParser: Tv2ActionParser,
    private readonly keyBindingFactory: KeyBindingFactory,
    private readonly actionService: ActionService,
    logger: Logger
  ) {
    this.logger = logger.tag('ActionTriggerProducerKeyBindingService')
    this.keyBindingsSubject = new BehaviorSubject(this.keyBindings)
  }

  public init(rundownId: string): void {
    this.actionTriggerSubscription = this.actionTriggerStateService.getActionTriggerObservable().subscribe(actionTriggers => this.onActionTriggersChanged(actionTriggers))

    this.actionStateService
      .subscribeToRundownActions(rundownId)
      .then(observable => observable.subscribe(actions => this.onActionsChanged(actions)))
      .then(subscription => (this.actionSubscription = subscription))
      .catch(error => this.logger.data(error).error('Error while listening to Action events'))

    this.rundownStateService
      .subscribeToRundown(rundownId)
      .then(observable => observable.subscribe(rundown => this.onRundownChanged(rundown)))
      .then(subscription => (this.rundownSubscription = subscription))
      .catch(error => this.logger.data(error).error('Error while listening to Rundown events'))
  }

  private onActionTriggersChanged(actionTriggers: ActionTrigger[]): void {
    this.setValidKeyboardActionTriggers(actionTriggers)
    this.mapActionTriggersToActions()
    this.emitNewKeybindings()
  }

  private setValidKeyboardActionTriggers(actionTriggers: ActionTrigger[]): void {
    this.actionTriggers = actionTriggers.map(actionTrigger => actionTrigger as ActionTrigger<KeyboardTriggerData>).filter(actionTrigger => 'keys' in actionTrigger.data)
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

  private emitNewKeybindings(): void {
    this.keyBindings = this.createKeyBindings()
    this.keyBindingsSubject.next(this.keyBindings)
  }

  private createKeyBindings(): KeyBinding[] {
    if (!this.rundown) {
      return []
    }

    const keyBindings: StyledKeyBinding[] = this.keyBindingFactory.createRundownKeyBindings(this.rundown)

    if (this.rundown.mode === RundownMode.INACTIVE) {
      return keyBindings
    }

    this.actionTriggersWithAction.forEach((action: Tv2Action, actionTrigger: ActionTrigger<KeyboardTriggerData>) => {
      keyBindings.push(this.createBinding(action, actionTrigger, this.rundown!.id))
    })
    return keyBindings
  }

  private createBinding(action: Tv2Action, actionTrigger: ActionTrigger<KeyboardTriggerData>, rundownId: string): StyledKeyBinding {
    return {
      keys: actionTrigger.data.keys,
      label: actionTrigger.data.label,
      onMatched: () => this.actionService.executeAction(action.id, rundownId, actionTrigger.data.actionArguments).subscribe(),
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
      case Tv2ActionContentType.SPLIT_SCREEN: {
        return SPLIT_SCREEN_COLOR
      }
      case Tv2ActionContentType.REPLAY: {
        return REPLAY_COLOR
      }
      case Tv2ActionContentType.VIDEO_CLIP: {
        return VIDEO_CLIP_COLOR
      }
      case Tv2ActionContentType.GRAPHICS: {
        return GRAPHICS_COLOR
      }
      default: {
        return ''
      }
    }
  }

  private onActionsChanged(actions: Action[]): void {
    this.setValidActions(actions)
    this.mapActionTriggersToActions()
    this.emitNewKeybindings()
  }

  private setValidActions(actions: Action[]): void {
    this.actions = actions.reduce((tv2Actions: Tv2Action[], action: Action) => {
      try {
        return [...tv2Actions, this.actionParser.parseTv2Action(action)]
      } catch (error) {
        this.logger.data({ error, action }).warn('Received invalid Tv2Action')
      }
      return tv2Actions
    }, [] as Tv2Action[])
  }

  private onRundownChanged(rundown?: Rundown): void {
    if (!rundown) {
      return
    }
    this.rundown = rundown
    this.emitNewKeybindings()
  }

  public subscribeToKeyBindings(): Observable<KeyBinding[]> {
    return this.keyBindingsSubject.asObservable()
  }

  public destroy(): void {
    this.keyBindingsSubject.complete()

    this.actionTriggerStateService.destroy()
    this.actionStateService.destroy()

    this.actionTriggerSubscription?.unsubscribe()
    this.actionSubscription?.unsubscribe()
    this.rundownSubscription?.unsubscribe()
  }
}
