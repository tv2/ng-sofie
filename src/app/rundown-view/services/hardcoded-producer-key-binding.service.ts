import { BehaviorSubject, Observable, Subject, SubscriptionLike } from 'rxjs'
import { ActionStateService } from '../../shared/services/action-state.service'
import { KeyBinding } from '../../keyboard/value-objects/key-binding'
import { KeyBindingFactory } from '../factories/key-binding.factory'
import { Tv2Action } from '../../shared/models/tv2-action'
import { Action } from '../../shared/models/action'
import { Tv2ActionContentTypeGrouping, Tv2ActionGroupService } from './tv2-action-group.service'
import { Injectable } from '@angular/core'
import { Logger } from '../../core/abstractions/logger.service'
import { KeyBindingService } from '../abstractions/key-binding.service'
import { Rundown } from '../../core/models/rundown'
import { RundownStateService } from '../../core/services/rundown-state.service'
import { Tv2ActionParser } from '../../shared/abstractions/tv2-action-parser.service'

@Injectable()
export class HardcodedProducerKeyBindingService implements KeyBindingService {
  private actions: Tv2Action[] = []
  private rundown?: Rundown
  private keyBindings: KeyBinding[] = []
  private readonly keyBindingsSubject: Subject<KeyBinding[]>
  private actionsSubscription?: SubscriptionLike
  private rundownSubscription?: SubscriptionLike
  private readonly logger: Logger

  constructor(
    private readonly actionStateService: ActionStateService,
    private readonly keyBindingFactory: KeyBindingFactory,
    private readonly tv2ActionGroupService: Tv2ActionGroupService,
    private readonly tv2ActionParser: Tv2ActionParser,
    private readonly rundownStateService: RundownStateService,
    logger: Logger
  ) {
    this.logger = logger.tag('HardcodedProducerKeyBindingService')
    this.keyBindingsSubject = new BehaviorSubject(this.keyBindings)
  }

  public init(rundownId: string): void {
    this.actionStateService
      .subscribeToRundownActions(rundownId, this.onActionsChanged.bind(this))
      .then(subscription => (this.actionsSubscription = subscription))
      .catch(error => this.logger.data(error).error('Encountered an error while subscribing to actions.'))

    this.rundownStateService
      .subscribeToRundown(rundownId, this.onRundownChanged.bind(this))
      .then(subscription => (this.rundownSubscription = subscription))
      .catch(error => this.logger.data(error).error(`Encountered an error while subscribing to rundown with id '${rundownId}'.`))
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
    this.keyBindings = this.createKeyBindings()
    this.keyBindingsSubject.next(this.keyBindings)
  }

  private createKeyBindings(): KeyBinding[] {
    if (!this.rundown) {
      return []
    }
    const actionsGroupedByContentType: Tv2ActionContentTypeGrouping = this.tv2ActionGroupService.getActionsGroupedByContentType(this.actions)
    if (!this.rundown.isActive) {
      return this.keyBindingFactory.createRundownKeyBindings(this.rundown)
    }
    return [...this.keyBindingFactory.createRundownKeyBindings(this.rundown), ...this.keyBindingFactory.createCameraKeyBindingsFromActions(actionsGroupedByContentType.camera, this.rundown.id)]
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
