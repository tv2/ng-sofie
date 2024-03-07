import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core'
import { Tv2Action } from '../../../shared/models/tv2-action'

@Component({
  selector: 'sofie-tv2-action-panel',
  templateUrl: './tv2-action-panel.component.html',
  styleUrls: ['./tv2-action-panel.component.scss'],
})
export class Tv2ActionPanelComponent {
  @Input()
  public title: string

  @Input()
  public actions: Tv2Action[]

  @Output()
  public executeAction: EventEmitter<Tv2Action> = new EventEmitter()

  @Input()
  @HostBinding('class.scrollable')
  public isScrollable: boolean = true

  public onExecuteAction(action: Tv2Action): void {
    this.executeAction.emit(action)
  }

  public trackAction(_index: number, action: Tv2Action): string {
    return action.id
  }
}
