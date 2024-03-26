import { Rundown } from '../../core/models/rundown'
import { RundownMode } from '../../core/enums/rundown-mode'
import { BasicRundown } from '../../core/models/basic-rundown'
import { RundownService } from '../../core/abstractions/rundown.service'
import { BasicRundownStateService } from '../../core/services/basic-rundown-state.service'
import { DialogService } from './dialog.service'
import { Injectable } from '@angular/core'

@Injectable()
export class DialogConfirmationService {
  private readonly activationOkButtonText: string = $localize`dialog.button.activate`
  private readonly activationMessage: string = $localize`dialog.message.activation`
  private readonly activationWarningMessage: string = $localize`dialog.message.activation.warning`

  private readonly rehearseOkButtonText: string = $localize`dialog.button.rehearse`
  private readonly rehearseMessage: string = $localize`dialog.message.rehearse`
  private readonly rehearseWarningMessage: string = $localize`dialog.message.rehearse.warning`

  constructor(
    private readonly dialogService: DialogService,
    private readonly basicRundownStateService: BasicRundownStateService,
    private readonly rundownService: RundownService
  ) {}

  public switchActivateRundownDialog(rundown: Rundown): void {
    if (rundown.mode === RundownMode.ACTIVE) {
      return
    }

    const nonIdleRundown: BasicRundown | undefined = this.basicRundownStateService.getNonIdleRundown()
    if (!nonIdleRundown) {
      this.dialogService.createConfirmDialog(rundown.name, this.activationMessage, this.activationOkButtonText, () => this.rundownService.activate(rundown.id).subscribe())
      return
    }

    if (nonIdleRundown.mode === RundownMode.REHEARSAL && nonIdleRundown.id === rundown.id) {
      this.dialogService.createConfirmDialog(rundown.name, this.activationMessage, this.activationOkButtonText, () => this.rundownService.activate(nonIdleRundown.id).subscribe())
      return
    }

    this.dialogService.createConfirmDialog(rundown.name, `${this.activationWarningMessage} "${nonIdleRundown.name}"`, `${this.activationOkButtonText}`, () =>
      this.rundownService.deactivate(nonIdleRundown.id).subscribe(() => this.rundownService.activate(rundown.id).subscribe())
    )
  }

  public switchRehearsalRundownDialog(rundown: Rundown): void {
    if (rundown.mode === RundownMode.REHEARSAL) {
      return
    }

    const nonIdleRundown: BasicRundown | undefined = this.basicRundownStateService.getNonIdleRundown()
    if (!nonIdleRundown) {
      this.dialogService.createConfirmDialog(rundown.name, this.rehearseMessage, this.rehearseOkButtonText, () => this.rundownService.rehearse(rundown.id).subscribe())
      return
    }

    this.dialogService.createConfirmDialog(rundown.name, `${this.rehearseWarningMessage} "${nonIdleRundown.name}"`, this.rehearseOkButtonText, () =>
      this.rundownService.deactivate(nonIdleRundown.id).subscribe(() => this.rundownService.rehearse(rundown.id).subscribe())
    )
  }
}
