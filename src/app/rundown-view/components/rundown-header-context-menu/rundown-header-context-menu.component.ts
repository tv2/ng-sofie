import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { RundownService } from '../../../shared/abstractions/rundown.service'
import { Rundown } from '../../../core/models/rundown'
import { DialogService } from '../../../shared/services/dialog.service'
import { ContextMenuOption } from '../../../shared/abstractions/context-menu-option'
import { DialogSeverity } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component'

@Component({
  selector: 'sofie-rundown-header-context-menu',
  templateUrl: './rundown-header-context-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RundownHeaderContextMenuComponent {
  @Input()
  public rundown: Rundown

  @Input()
  public shortenedRundownName: string

  private readonly contextMenuOptionsForInactiveRundown: ContextMenuOption[] = [
    {
      label: 'Activate (On Air)',
      contextAction: (): void => this.openActivateRundownDialog(),
    },
    {
      label: 'Reset Rundown',
      contextAction: (): void => this.openResetRundownDialog(),
    },
  ]

  private readonly contextMenuOptionsForActiveRundown: ContextMenuOption[] = [
    {
      label: 'Deactivate',
      contextAction: (): void => this.openDeactivateRundownDialog(),
    },
    {
      label: 'Take',
      contextAction: (): void => this.take(),
    },
    {
      label: 'Reset Rundown',
      contextAction: (): void => this.openResetRundownDialog(),
    },
    {
      label: 'Reingest data',
      contextAction: (): void => this.reingestData(),
    },
  ]

  public get contextMenuOptions(): ContextMenuOption[] {
    return this.rundown.isActive ? this.contextMenuOptionsForActiveRundown : this.contextMenuOptionsForInactiveRundown
  }

  constructor(
    private readonly rundownService: RundownService,
    private readonly dialogService: DialogService
  ) {}

  public openActivateRundownDialog(): void {
    this.dialogService.createConfirmDialog(this.rundown.name, 'Are you sure you want to activate the Rundown?', 'Activate', () => this.activateRundown())
  }

  public activateRundown(): void {
    this.rundownService.activate(this.rundown.id).subscribe()
  }

  public openDeactivateRundownDialog(): void {
    this.dialogService.createConfirmDialog(
      this.rundown.name,
      'Are you sure you want to deactivate the Rundown?\n\nThis will clear the outputs.',
      'Deactivate',
      () => this.deactivateRundown(),
      DialogSeverity.DANGER
    )
  }

  private deactivateRundown(): void {
    this.rundownService.deactivate(this.rundown.id).subscribe()
  }

  private take(): void {
    this.rundownService.takeNext(this.rundown.id).subscribe()
  }

  public openResetRundownDialog(): void {
    this.dialogService.createConfirmDialog(this.rundown.name, 'Are you sure you want to reset the Rundown?', 'Reset', () => this.resetRundown())
  }

  private resetRundown(): void {
    this.rundownService.reset(this.rundown.id).subscribe()
  }

  public reingestData(): void {
    this.rundownService.reingest(this.rundown.id).subscribe()
  }
}
