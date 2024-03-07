import { Component, Input } from '@angular/core'
import { FileDownloadService } from '../../abstractions/file-download.service'
import { NotificationService } from '../../services/notification.service'

@Component({
  selector: 'sofie-json-export-button',
  templateUrl: './json-export-button.component.html',
})
export class JsonExportButtonComponent<T> {
  @Input() public exportData: T
  @Input() public exportedFileName: string

  constructor(
    private readonly fileDownloadService: FileDownloadService,
    private readonly notificationService: NotificationService
  ) {}

  public exportFile(): void {
    if (!this.exportData) {
      this.notificationService.createWarningNotification("Can't export to file. No data provided")
      return
    }

    if (!this.exportedFileName) {
      this.notificationService.createWarningNotification("Can't export to file. No filename provided")
      return
    }

    this.fileDownloadService.downloadJson(this.exportData, this.exportedFileName)
  }
}
