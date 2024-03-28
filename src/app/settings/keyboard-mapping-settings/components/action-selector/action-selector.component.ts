import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ActionStateService } from '../../../../shared/services/action-state.service'
import { Logger } from '../../../../core/abstractions/logger.service'
import { Tv2Action } from '../../../../shared/models/tv2-action'

@Component({
  selector: 'sofie-action-selector',
  templateUrl: './action-selector.component.html',
  styleUrls: ['./action-selector.component.scss'],
})
export class ActionSelectorComponent implements OnInit {
  @Input() public selectedAction?: Tv2Action
  @Output() public actionSelected: EventEmitter<Tv2Action> = new EventEmitter()
  @Input() public hasError: boolean
  @Input() public errorMessage: string

  public actions: Tv2Action[] = []

  public actionSearchQuery: string = ''

  private readonly logger: Logger

  constructor(
    private readonly actionStateService: ActionStateService,
    logger: Logger
  ) {
    this.logger = logger.tag('ActionTriggerSelector')
  }

  public ngOnInit(): void {
    this.actionStateService
      .subscribeToSystemActions()
      .then(observable => observable.subscribe(actions => (this.actions = actions as Tv2Action[])))
      .catch(error => this.logger.data(error).error('Error while listening to Action events'))
  }

  public selectAction(action: Tv2Action): void {
    this.selectedAction = action
    this.actionSelected.emit(this.selectedAction)
  }

  public doesActionMatchSearchQuery(action: Tv2Action): boolean {
    if (!this.actionSearchQuery) {
      return true
    }
    const lowerCasedSearchQuery: string = this.actionSearchQuery.toLowerCase()
    const doesNameMatch: boolean = action.name.toLowerCase().includes(lowerCasedSearchQuery)
    const doesTypeMatch: boolean = action.metadata.contentType.toLowerCase().includes(lowerCasedSearchQuery)
    const isActionSelected: boolean = !!this.selectedAction && action.id === this.selectedAction.id

    return doesNameMatch || doesTypeMatch || isActionSelected
  }

  public isSelectedAction(action: Tv2Action): boolean {
    return !!this.selectedAction && action.id === this.selectedAction.id
  }
}
