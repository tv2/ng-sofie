import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { Rundown } from '../../../core/models/rundown'

@Component({
  selector: 'sofie-rundown-header-context-menu',
  templateUrl: './rundown-header-context-menu.component.html',
  styleUrls: ['./rundown-header-context-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RundownHeaderContextMenuComponent {
  @Input()
  public rundown?: Rundown

  constructor(private readonly rundownService: RundownService) {}

  public activate(): void {
    if (!this.rundown?.id) {
      return
    }
    this.rundownService.activate(this.rundown.id).subscribe()
  }

  public deactivate(): void {
    if (!this.rundown?.id) {
      return
    }
    this.rundownService.deactivate(this.rundown.id).subscribe()
  }

  public take(): void {
    if (!this.rundown?.id) {
      return
    }
    this.rundownService.takeNext(this.rundown.id).subscribe()
  }

  public resetRundown(): void {
    if (!this.rundown?.id) {
      return
    }
    this.rundownService.reset(this.rundown.id).subscribe()
  }
}
