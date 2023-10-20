import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { KeyBinding } from '../../../keyboard/models/key-binding'
import { Rundown } from '../../../core/models/rundown'
import { ActionStateService } from '../../../shared/services/action-state.service'
import { Action } from '../../../shared/models/action'
import { EventSubscription } from '../../../event-system/abstractions/event-observer.service'
import { Logger } from '../../../core/abstractions/logger.service'
import { Tv2Action, Tv2ActionContentType } from '../../../shared/models/tv2-action'
import { Tv2ActionParser } from '../../../shared/abstractions/tv2-action-parser.service'
import { ActionService } from '../../../shared/abstractions/action.service'

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

  private actionsSubscription?: EventSubscription

  public cameraActions: Tv2Action[] = []
  public videoClipActions: Tv2Action[] = []

  private readonly logger: Logger

  constructor(
    private readonly actionStateService: ActionStateService,
    private readonly tv2ActionParser: Tv2ActionParser,
    private readonly actionService: ActionService,
    logger: Logger
  ) {
    this.logger = logger.tag('ProducerShelfComponent')
  }

  public ngOnInit(): void {
    this.actionStateService
      .subscribeToRundownActions(this.rundown.id, this.onActionsChanged.bind(this))
      .then(actionsSubscription => (this.actionsSubscription = actionsSubscription))
      .catch(error => this.logger.data(error).error('Failed subscribing to actions.'))
  }

  private onActionsChanged(actions: Action[]): void {
    const tv2Actions: Tv2Action[] = this.getValidTv2Actions(actions)
    // TODO: create Tv2ActionsStateService that also groups them
    this.cameraActions = tv2Actions.filter(action => action.metadata.contentType === Tv2ActionContentType.CAMERA)
    this.videoClipActions = tv2Actions.filter(action => action.metadata.contentType === Tv2ActionContentType.VIDEO_CLIP)
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
