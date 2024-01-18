import { Injectable } from '@angular/core'
import { FileDownloadService } from '../../abstractions/file-download.service'

@Injectable()
export class HttpFileDownloadService implements FileDownloadService {
  public downloadText(text: string, filename: string): void {
    const anchorElement: HTMLAnchorElement = document.createElement('a')
    anchorElement.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(text))
    anchorElement.setAttribute('download', filename)
    anchorElement.click()
  }
}
