import { Component, Input } from '@angular/core'
import { FileDownloadService } from '../../abstractions/file-download.service'

@Component({
  selector: 'sofie-json-export-button',
  templateUrl: './json-export-button.component.html',
})
export class JsonExportButtonComponent<T> {
  @Input() public exportData: T
  @Input() public exportedFileName: string

  constructor(private readonly fileDownloadService: FileDownloadService) {}

  public exportFile(): void {
    if (!this.exportData) {
      // TODO: Make notification when we have the new notification changes
      console.log('No data to export!')
      return
    }

    if (!this.exportedFileName) {
      // TODO: Make notification when we have the new notification changes
      console.log('No filename provided!')
      return
    }

    this.fileDownloadService.downloadJson(this.exportData, this.exportedFileName)
  }
}
