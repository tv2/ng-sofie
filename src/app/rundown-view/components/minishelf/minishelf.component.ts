import { Component, Input } from '@angular/core'
import { Logger } from '../../../core/abstractions/logger.service'
import { Segment } from '../../../core/models/segment'

@Component({
  selector: 'sofie-minishelf',
  templateUrl: './minishelf.component.html',
  styleUrls: ['./minishelf.component.scss'],
})
export class MinishelfComponent {
  @Input()
  public segment: Segment

  private readonly logger: Logger
  private readonly data: { prop: string }

  constructor(logger: Logger) {
    this.logger = logger.tag('MinishelfComponent')
    this.data = { prop: 'value' }
  }
}
