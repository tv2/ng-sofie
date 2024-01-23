import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Tv2PartAction } from 'src/app/shared/models/tv2-action'

@Component({
  selector: 'sofie-single-action-trigger-box',
  templateUrl: './single-action-trigger-box.component.html',
  styleUrls: ['./single-action-trigger-box.component.scss'],
})
export class SingleActionTriggerBoxComponent {
  @Output() private readonly onSelect: EventEmitter<Tv2PartAction> = new EventEmitter<Tv2PartAction>()
  @Input() public action: Tv2PartAction
  @Input() public isSelected: boolean
  @Input() public isSubmitting: boolean

  public selectNewAction(): void {
    if (this.isSubmitting) {
      return
    }
    this.onSelect.emit(this.action)
  }
}
