import { Injectable } from '@angular/core'

export interface FileDownloaderService {
  downloadText(text: string, filename: string): void
}

@Injectable()
export class HttpFileDownloadService implements FileDownloaderService {
  public downloadText(text: string, filename: string): void {
    const anchorElement: HTMLAnchorElement = document.createElement('a')
    anchorElement.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(text))
    anchorElement.setAttribute('download', filename)
    anchorElement.click()
  }
}
