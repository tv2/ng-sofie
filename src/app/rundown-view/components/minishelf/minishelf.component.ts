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

  constructor(logger: Logger) {
    this.logger = logger.tag('MinishelfComponent')
  }
}
