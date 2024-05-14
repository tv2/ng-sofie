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
import { SystemKeyBindingFactory } from '../factories/system-key-binding-factory.service'
import { Tv2Action, Tv2ActionContentType, Tv2ContentPlaceholderAction } from '../../shared/models/tv2-action'
import { Logger } from '../../core/abstractions/logger.service'
import { StyledKeyBinding } from '../../keyboard/value-objects/styled-key-binding'
import { ActionService } from '../../shared/abstractions/action.service'
import { KeyboardTriggerData } from 'src/app/shared/models/keyboard-trigger-data'
import { RundownMode } from '../../core/enums/rundown-mode'
import { PlaceholderActionScope, PlaceholderActionType } from '../../shared/models/action-type'
import { Segment } from '../../core/models/segment'

const CAMERA_COLOR: string = 'var(--tv2-camera-color)'
const REMOTE_COLOR: string = 'var(--tv2-remote-color)'
const SPLIT_SCREEN_COLOR: string = 'var(--tv2-split-screen-upper)'
const REPLAY_COLOR: string = 'var(--tv2-replay-color)'
const VIDEO_CLIP_COLOR: string = 'var(--tv2-video-clip-color)'
const GRAPHICS_COLOR: string = 'var(--tv2-graphics-color)'
const TRANSITION_COLOR: string = 'var(--tv2-transition-color)'

@Injectable()
export class ActionTriggerProducerKeyBindingService implements KeyBindingService {
  private actions: Tv2Action[] = []
  private rundown?: Rundown
  private systemKeyBindings: KeyBinding[] = []
  private actionTriggerKeyBindings: KeyBinding[] = []
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
    private readonly systemKeyBindingFactory: SystemKeyBindingFactory,
    private readonly actionService: ActionService,
    logger: Logger
  ) {
    this.logger = logger.tag('ActionTriggerProducerKeyBindingService')
    this.keyBindingsSubject = new BehaviorSubject(this.systemKeyBindings)
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
    this.updateActionTriggerKeybindings()
    this.emitKeybindings()
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
      const action: Tv2Action | undefined = this.findActionForActionTrigger(actionTrigger)
      if (!action) {
        return
      }
      this.actionTriggersWithAction.set(actionTrigger, action)
    })
  }

  private findActionForActionTrigger(actionTrigger: ActionTrigger<KeyboardTriggerData>): Tv2Action | undefined {
    const action: Tv2Action | undefined = this.actions.find(action => action.id === actionTrigger.actionId)
    if (action?.type === PlaceholderActionType.CONTENT) {
      return this.findActionForContentPlaceholderAction(action as Tv2ContentPlaceholderAction, actionTrigger)
    }
    return action
  }

  private findActionForContentPlaceholderAction(placeholderAction: Tv2ContentPlaceholderAction, actionTrigger: ActionTrigger<KeyboardTriggerData>): Tv2Action | undefined {
    const filterCallback: (action: Tv2Action) => boolean = this.getActionFilterCallbackForPlaceholderAction(placeholderAction)

    const actionsForSegmentToSearch: Tv2Action[] = this.actions.filter(filterCallback).sort((a, b) => a.rank - b.rank)
    const indexToSelect: number = actionTrigger.data.actionArguments as number // We know this is a number because of Tv2ContentPlaceholderAction.
    if (indexToSelect > actionsForSegmentToSearch.length) {
      return
    }
    return actionsForSegmentToSearch[indexToSelect - 1] // indexToSelect is one-indexed, so we need to subtract one to get the correct index.
  }

  private getActionFilterCallbackForPlaceholderAction(placeholderAction: Tv2ContentPlaceholderAction): (action: Tv2Action) => boolean {
    switch (placeholderAction.metadata.scope) {
      case PlaceholderActionScope.ON_AIR_SEGMENT: {
        const onAirSegment: Segment | undefined = this.rundown?.segments.find(segment => segment.isOnAir)
        if (!onAirSegment) {
          break
        }
        return action => Math.floor(action.rank) === onAirSegment.rank && placeholderAction.metadata.allowedContentTypes.includes(action.metadata.contentType)
      }
      default: {
        this.logger.warn(`Placeholder scope ${placeholderAction.metadata.scope} is not supported.`)
      }
    }
    return () => false
  }

  private updateActionTriggerKeybindings(): void {
    this.actionTriggerKeyBindings = Array.from(this.actionTriggersWithAction, ([actionTrigger, action]) => this.createBinding(action, actionTrigger, this.rundown!.id))
  }

  private emitKeybindings(): void {
    this.keyBindingsSubject.next([...this.systemKeyBindings, ...this.actionTriggerKeyBindings])
  }

  private createBinding(action: Tv2Action, actionTrigger: ActionTrigger<KeyboardTriggerData>, rundownId: string): StyledKeyBinding {
    return {
      keys: actionTrigger.data.keys,
      mappedKeys: actionTrigger.data.mappedToKeys,
      label: this.getActionTriggerLabel(actionTrigger, action),
      onMatched: () => this.actionService.executeAction(action.id, rundownId, actionTrigger.data.actionArguments).subscribe(),
      shouldMatchOnKeyRelease: true,
      shouldPreventDefaultBehaviourOnKeyPress: true,
      shouldPreventDefaultBehaviourForPartialMatches: true,
      useExclusiveMatching: true,
      useOrderedMatching: false,
      background: this.getKeyBindingBackgroundColour(action),
    }
  }

  private getActionTriggerLabel(actionTrigger: ActionTrigger<KeyboardTriggerData>, action: Tv2Action): string {
    if (actionTrigger.data.label) {
      return actionTrigger.data.label
    }
    return action.name
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
      case Tv2ActionContentType.TRANSITION: {
        return TRANSITION_COLOR
      }
      default: {
        return ''
      }
    }
  }

  private onActionsChanged(actions: Action[]): void {
    this.setValidActions(actions)
    this.mapActionTriggersToActions()
    this.updateActionTriggerKeybindings()
    this.emitKeybindings()
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
    this.mapActionTriggersToActions()
    this.updateActionTriggerKeybindings()
    this.updateSystemKeyBindings()
    this.emitKeybindings()
  }

  private updateSystemKeyBindings(): void {
    this.systemKeyBindings = this.createSystemKeyBindings()
  }

  private createSystemKeyBindings(): KeyBinding[] {
    if (!this.rundown) {
      return []
    }

    switch (this.rundown.mode) {
      case RundownMode.ACTIVE: {
        return this.systemKeyBindingFactory.createActiveRundownKeyBindings(this.rundown)
      }
      case RundownMode.REHEARSAL: {
        return this.systemKeyBindingFactory.createRehearsalRundownKeyBindings(this.rundown)
      }
      case RundownMode.INACTIVE: {
        return this.systemKeyBindingFactory.createInactiveRundownKeyBindings(this.rundown)
      }
    }
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
