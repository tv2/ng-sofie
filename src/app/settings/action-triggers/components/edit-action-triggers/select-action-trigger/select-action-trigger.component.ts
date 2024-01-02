import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Tv2PartAction } from 'src/app/shared/models/tv2-action'

@Component({
  selector: 'sofie-select-action-trigger',
  templateUrl: './select-action-trigger.component.html',
  styleUrls: ['./select-action-trigger.component.scss'],
})
export class SelectActionTriggerComponent {
  @Output() private readonly selectActionTrigger: EventEmitter<Tv2PartAction> = new EventEmitter<Tv2PartAction>()
  @Input() public actions: Tv2PartAction[]
  @Input() public selectedActionId: string | undefined
  @Input() public submitting: boolean
  public search: string = ''

  public newActionSelected(action: Tv2PartAction): void {
    this.selectActionTrigger.emit(action)
  }

  get filteredActions(): Tv2PartAction[] {
    return this.actions.filter(action => action.name.toLocaleLowerCase().includes(this.search.toLocaleLowerCase()) || action.id === this.selectedActionId)
  }
}
