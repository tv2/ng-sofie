import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'sofie-json-import-button',
  templateUrl: './json-import-button.component.html',
  styleUrls: ['./json-import-button.component.scss'],
})
export class JsonImportButtonComponent<T> {
  @Input() public validator: (data: T) => boolean
  @Output() public onUpload: EventEmitter<T> = new EventEmitter()

  constructor() {}

  public onFileSelected(inputElement: HTMLInputElement): void {
    const files: FileList | null = inputElement.files
    if (!files) {
      // TODO: Notify when we get new notification changes
      console.log('Failed to upload file...')
      return
    }

    const fileReader: FileReader = new FileReader()
    fileReader.onload = (): void => {
      const arrayBuffer: ArrayBuffer = fileReader.result as ArrayBuffer
      if (!arrayBuffer) {
        return
      }

      const jsonObject: T = JSON.parse(new TextDecoder().decode(arrayBuffer))
      if (!!this.validator && !this.validator(jsonObject)) {
        // TODO: Notify about invalid when we get the new notification changes.
        console.log('Uploaded file does not parse validation...')
        return
      }
      this.onUpload.emit(jsonObject)
    }
    fileReader.readAsArrayBuffer(files[0])
    inputElement.value = ''
  }
}
