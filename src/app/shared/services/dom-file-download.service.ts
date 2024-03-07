import { Injectable } from '@angular/core'
import { FileDownloadService } from '../abstractions/file-download.service'

const JSON_EXTENSION: string = '.json'

@Injectable()
export class DomFileDownloadService implements FileDownloadService {
  public downloadText(text: string, filename: string): void {
    const anchorElement: HTMLAnchorElement = document.createElement('a')
    anchorElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    anchorElement.setAttribute('download', filename)
    anchorElement.click()
  }

  public downloadJson(data: unknown, filename: string): void {
    const text: string = JSON.stringify(data)
    if (!filename.includes(JSON_EXTENSION)) {
      filename = `${filename}${JSON_EXTENSION}`
    }
    this.downloadText(text, filename)
  }
}
