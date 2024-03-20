import { Component, EventEmitter, Input, Output } from '@angular/core'
import { NotificationService } from '../../services/notification.service'

@Component({
  selector: 'sofie-json-import-button',
  templateUrl: './json-import-button.component.html',
  styleUrls: ['./json-import-button.component.scss'],
})
export class JsonImportButtonComponent<T> {
  @Input() public validator: (data: T) => boolean
  @Output() public onUpload: EventEmitter<T> = new EventEmitter()

  constructor(private readonly notificationService: NotificationService) {}

  public onFileSelected(inputElement: HTMLInputElement): void {
    const files: FileList | null = inputElement.files
    if (!files || files.length <= 0) {
      this.notificationService.createWarningNotification('Unable to import file. No file found!')
      return
    }

    const fileReader: FileReader = new FileReader()
    fileReader.onload = (): void => {
      const arrayBuffer: ArrayBuffer = fileReader.result as ArrayBuffer
      if (!arrayBuffer) {
        return
      }

      const jsonData: T = JSON.parse(new TextDecoder().decode(arrayBuffer))
      if (!!this.validator && !this.validator(jsonData)) {
        this.notificationService.createErrorNotification('Unable to import file. Imported file does not parse validation!')
        return
      }
      this.onUpload.emit(jsonData)
    }
    fileReader.readAsArrayBuffer(files[0])
    inputElement.value = ''
  }
}
