import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Tv2Action } from '../../../../shared/models/tv2-action'

@Component({
  selector: 'sofie-edit-static-buttons',
  templateUrl: './edit-static-buttons.component.html',
  styleUrls: ['./edit-static-buttons.component.scss'],
})
export class EditStaticButtonsComponent implements OnInit {
  @Input()
  public selectedStaticActions?: Tv2Action[]

  @Output() public onSave: EventEmitter<Tv2Action[]> = new EventEmitter()
  @Output() public onCancel: EventEmitter<void> = new EventEmitter()

  public updatedSelectedStaticActions: Tv2Action[] = []
  public selectedAction: Tv2Action

  constructor() {}

  public ngOnInit(): void {
    if (this.selectedStaticActions) {
      this.selectedStaticActions.forEach(action => this.updatedSelectedStaticActions.push(action))
    }
  }

  public addSelectedAction(action: Tv2Action): void {
    this.selectedAction = action
    if (this.updatedSelectedStaticActions.includes(this.selectedAction)) {
      return
    }
    this.updatedSelectedStaticActions.push(this.selectedAction)
  }

  public removeAction(actionToRemove: Tv2Action): void {
    this.updatedSelectedStaticActions = this.updatedSelectedStaticActions.filter(action => action.id !== actionToRemove.id)
  }

  public save(): void {
    this.onSave.emit(this.updatedSelectedStaticActions)
  }

  public cancel(): void {
    this.onCancel.emit()
  }
}
