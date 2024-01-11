export class FilesUtil {
  public static saveText(text: string, filename: string): void {
    const anchorElement: HTMLAnchorElement = document.createElement('a')
    anchorElement.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(text))
    anchorElement.setAttribute('download', filename)
    anchorElement.click()
  }
}
