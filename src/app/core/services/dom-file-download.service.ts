import { Injectable } from '@angular/core'
import { FileDownloadService } from '../abstractions/file-download.service'

@Injectable()
export class DomFileDownloadService implements FileDownloadService {
  public downloadText(text: string, filename: string): void {
    const anchorElement: HTMLAnchorElement = document.createElement('a')
    anchorElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    anchorElement.setAttribute('download', filename)
    anchorElement.click()
  }
}
