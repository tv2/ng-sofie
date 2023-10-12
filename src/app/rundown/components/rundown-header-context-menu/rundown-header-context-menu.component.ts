import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { RundownService } from '../../../core/abstractions/rundown.service'
import { Rundown } from '../../../core/models/rundown'
import { DialogService } from '../../../shared/services/dialog.service'
import { ContextMenuOption } from '../../../shared/abstractions/context-menu-option'

@Component({
  selector: 'sofie-rundown-header-context-menu',
  templateUrl: './rundown-header-context-menu.component.html',
  styleUrls: ['./rundown-header-context-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RundownHeaderContextMenuComponent {
  @Input()
  public rundown?: Rundown

  @Input()
  public shortenedRundownName: string

  public readonly deactivatedContextMenuOptions: ContextMenuOption[] = [
    {
      label: 'Activate (On Air)',
      contextAction: (): void => this.openActivationDialog(),
    },
    {
      label: 'Reset Rundown',
      contextAction: (): void => this.resetRundown(),
    },
  ]

  public readonly activatedContextMenuOptions: ContextMenuOption[] = [
    {
      label: 'Deactivate',
      contextAction: (): void => this.openDeactivationDialog(),
    },
    {
      label: 'Take',
      contextAction: (): void => this.take(),
    },
    {
      label: 'Reset Rundown',
      contextAction: (): void => this.resetRundown(),
    },
  ]

  constructor(
    private readonly rundownService: RundownService,
    private readonly dialogService: DialogService
  ) {}

  public openActivationDialog(): void {
    if (!this.rundown || this.rundown.isActive) {
      return
    }
    this.dialogService.createConfirmDialog(this.rundown.name, `Are you sure you want to activate the Rundown?`, 'Activate', () => this.activate())
  }

  public openDeactivationDialog(): void {
    if (!this.rundown || !this.rundown.isActive) {
      return
    }
    this.dialogService.createConfirmDialog(this.rundown.name, `Are you sure you want to deactivate this Rundown?`, 'Deactivate', () => this.deactivate())
  }

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
