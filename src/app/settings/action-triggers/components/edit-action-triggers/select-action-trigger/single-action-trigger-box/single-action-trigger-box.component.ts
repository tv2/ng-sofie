import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Tv2PartAction } from 'src/app/shared/models/tv2-action'

@Component({
  selector: 'sofie-single-action-trigger-box',
  templateUrl: './single-action-trigger-box.component.html',
  styleUrls: ['./single-action-trigger-box.component.scss'],
})
export class SingleActionTriggerBoxComponent implements OnInit {
  @Output() private readonly actionSelect: EventEmitter<Tv2PartAction> = new EventEmitter<Tv2PartAction>()
  @Input() public action: Tv2PartAction
  @Input() public isSelected: boolean
  @Input() public submitting: boolean
  public classExpression: string

  public ngOnInit(): void {
    this.classExpression = this.action.metadata.contentType
  }

  public selectNewAction(): void {
    this.actionSelect.emit(this.action)
  }
}
