import { Component, HostListener, Input } from '@angular/core'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { Rundown } from '../../../core/models/rundown'
import { Segment } from '../../../core/models/segment'
import { DialogService } from '../../../shared/services/dialog.service'

@Component({
  selector: 'sofie-rundown',
  templateUrl: './rundown.component.html',
  styleUrls: ['./rundown.component.scss'],
})
export class RundownComponent {
  //TODO: Remove this temporary implementation once keyboard shortcuts are added
  @HostListener('document:keypress', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.code === 'Backquote') {
      this.openActivationDialog()
    }
  }

  @Input()
  public rundown?: Rundown

  constructor(
    private readonly rundownService: RundownService,
    private readonly dialogService: DialogService
  ) {}

  public openActivationDialog(): void {
    if (!this.rundown || this.rundown.isActive) {
      return
    }
    this.dialogService.createConfirmDialog(this.rundown.name, `Are you sure you want to activate the Rundown?`, 'Activate', () => this.activateRundown())
  }

  public activateRundown(): void {
    if (!this.rundown?.id) {
      return
    }
    this.rundownService.activate(this.rundown.id).subscribe()
  }

  public trackSegment(_: number, segment: Segment): string {
    return segment.id
  }
}
