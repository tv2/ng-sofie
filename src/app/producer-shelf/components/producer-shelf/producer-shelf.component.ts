import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { KeyBinding } from '../../../keyboard/value-objects/key-binding'
import { Rundown } from '../../../core/models/rundown'
import { ActionStateService } from '../../../shared/services/action-state.service'
import { Action } from '../../../shared/models/action'
import { EventSubscription } from '../../../event-system/abstractions/event-observer.service'
import { Logger } from '../../../core/abstractions/logger.service'
import { Tv2Action } from '../../../shared/models/tv2-action'
import { Tv2ActionParser } from '../../../shared/abstractions/tv2-action-parser.service'
import { ActionService } from '../../../shared/abstractions/action.service'
import { ConfigurationService } from '../../../shared/services/configuration.service'
import { Shelf } from '../../../shared/models/shelf'

const STATIC_BUTTON_ACTION_IDS: string[] = [
  'overlayInitializeAction',
  'continueGraphicsAction',
  'clearGraphicsAction',
  'fadePersistedAudioAction',
  'allOutGraphicsAction',
  'themeOutAction',
  'downstreamKeyer1OnAction',
  'downstreamKeyer2OnAction',
  'downstreamKeyer1OffAction',
  'downstreamKeyer2OffAction',
  'studioMicrophonesUpAction',
  'studioMicrophonesDownAction',
  'studioMicrophonesDownAction',
]

@Component({
  selector: 'sofie-producer-shelf',
  templateUrl: './producer-shelf.component.html',
  styleUrls: ['./producer-shelf.component.scss'],
})
export class ProducerShelfComponent implements OnInit, OnDestroy {
  @Input()
  public keyBindings: KeyBinding[]

  @Input()
  public keystrokes: string[]

  @Input()
  public rundown: Rundown

  public resolvedActionPanels: {
    name: string
    actions: Tv2Action[]
  }[] = []

  public staticButtonActions: Tv2Action[] = []

  private shelf?: Shelf
  private actions: Tv2Action[] = []

  private actionsSubscription?: EventSubscription

  private readonly logger: Logger

  constructor(
    private readonly actionStateService: ActionStateService,
    private readonly tv2ActionParser: Tv2ActionParser,
    private readonly actionService: ActionService,
    private readonly configurationService: ConfigurationService,
    logger: Logger
  ) {
    this.logger = logger.tag('ProducerShelfComponent')
  }

  public ngOnInit(): void {
    this.actionStateService
      .subscribeToRundownActions(this.rundown.id)
      .then(actionsObservable => actionsObservable.subscribe(this.onActionsChanged.bind(this)))
      .then(actionsSubscription => (this.actionsSubscription = actionsSubscription))
      .catch(error => this.logger.data(error).error('Failed subscribing to actions.'))

    this.configurationService.getShelfConfiguration().subscribe(shelf => {
      this.shelf = shelf
      this.updateActionPanels()
    })
  }

  private updateActionPanels(): void {
    if (!this.shelf) {
      return
    }
    this.resolvedActionPanels = this.shelf.actionPanels
      .sort((a, b) => a.rank - b.rank)
      .map(actionPanel => {
        return {
          name: actionPanel.name,
          actions: this.actions.filter(action => actionPanel.actionFilter.includes(action.metadata.contentType)),
        }
      })
  }

  private onActionsChanged(actions: Action[]): void {
    this.actions = this.getValidTv2Actions(actions)
    this.updateActionPanels()
    this.updateStaticButtonActions()
  }

  private updateStaticButtonActions(): void {
    this.staticButtonActions = this.actions.filter(action => STATIC_BUTTON_ACTION_IDS.includes(action.id))
  }

  private getValidTv2Actions(actions: Action[]): Tv2Action[] {
    return actions.reduce((tv2Actions: Tv2Action[], action: Action) => {
      try {
        return [...tv2Actions, this.tv2ActionParser.parseTv2Action(action)]
      } catch (error) {
        this.logger.data({ error, action }).warn('Received invalid Tv2Action')
      }
      return tv2Actions
    }, [] as Tv2Action[])
  }

  public executeAction(action: Tv2Action): void {
    this.actionService.executeAction(action.id, this.rundown.id).subscribe()
  }

  public ngOnDestroy(): void {
    this.actionsSubscription?.unsubscribe()
  }
}
