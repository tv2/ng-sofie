export class FilesUtil {
  public static saveText(text: string, filename: string): void {
    const a = document.createElement('a')
    a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(text))
    a.setAttribute('download', filename)
    a.click()
  }
}
