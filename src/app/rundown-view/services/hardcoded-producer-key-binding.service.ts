import { BehaviorSubject, Observable, Subject, SubscriptionLike } from 'rxjs'
import { ActionStateService } from '../../shared/services/action-state.service'
import { KeyBinding } from '../../keyboard/models/key-binding'
import { KeyBindingFactory } from '../factories/key-binding.factory'
import { Tv2Action } from '../../shared/models/tv2-action'
import { Action } from '../../shared/models/action'
import { Tv2ActionContentTypeGrouping, Tv2ActionGroupService } from './tv2-action-group.service'
import { Injectable } from '@angular/core'
import { Logger } from '../../core/abstractions/logger.service'
import { ProducerKeyBindingService } from '../abstractions/producer-key-binding.service'
import { Rundown } from '../../core/models/rundown'

@Injectable()
export class HardcodedProducerKeyBindingService implements ProducerKeyBindingService {
  private subscription?: SubscriptionLike
  private actions: Tv2Action[] = []
  private keyBindings: KeyBinding[] = []
  private readonly keyBindingsSubject: Subject<KeyBinding[]>
  private rundown: Rundown
  private readonly logger: Logger

  // TODO implement the action parser
  private readonly tv2ActionParser = {
    parse(action: Action): Tv2Action {
      if (!('metadata' in action)) {
        throw new Error('Tv2Action is missing metadata attribute.')
      }
      return action as Tv2Action
    },
  }

  constructor(
    private readonly actionStateService: ActionStateService,
    private readonly keyBindingFactory: KeyBindingFactory,
    private readonly tv2ActionGroupService: Tv2ActionGroupService,
    logger: Logger
  ) {
    this.logger = logger.tag('HardcodedProducerKeyBindingService')
    this.keyBindingsSubject = new BehaviorSubject(this.keyBindings)
  }

  public init(rundown: Rundown): void {
    this.rundown = rundown
    this.actionStateService
      .subscribeToRundownActions(rundown.id, this.onActionsChanged.bind(this))
      .then(subscription => (this.subscription = subscription))
      .catch(error => this.logger.data(error).error('Encountered an error while subscribing to actions.'))
  }

  private onActionsChanged(actions: Action[]): void {
    this.actions = actions.reduce((tv2Actions: Tv2Action[], action: Action) => {
      try {
        return [...tv2Actions, this.tv2ActionParser.parse(action)]
      } catch (error) {
        this.logger.data({ error, action }).warn('Received invalid Tv2Action')
      }
      return tv2Actions
    }, [] as Tv2Action[])
    this.keyBindings = this.createKeyBindings()
    this.keyBindingsSubject.next(this.keyBindings)
  }

  private createKeyBindings(): KeyBinding[] {
    const actionsGroupedByContentType: Tv2ActionContentTypeGrouping = this.tv2ActionGroupService.getActionsGroupedByContentType(this.actions)
    return [...this.keyBindingFactory.createRundownKeyBindings(this.rundown), ...this.keyBindingFactory.createCameraKeyBindingsFromActions(actionsGroupedByContentType.camera, this.rundown.id)]
  }

  public subscribeToKeyBindings(): Observable<KeyBinding[]> {
    return this.keyBindingsSubject.asObservable()
  }

  public destroy(): void {
    this.keyBindingsSubject.complete()
    this.actionStateService.destroy()
    this.subscription?.unsubscribe()
  }
}
